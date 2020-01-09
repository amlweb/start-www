let path = require('path');
let util = require('gulp-util');
let chalk = util.colors;
let scssToJson = require('scss-to-json');
let webpack = require('webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let CompressionPlugin = require('compression-webpack-plugin');
let CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
let getFilename = require('./get-filename');
let config = require('./config.json');

// Paths and filenames
let rootPath = path.resolve(__dirname, config.paths.root) + '/';
let sourcesPath = rootPath + config.paths.sources;
let entryPath = rootPath + config.paths.sources + config.dirs.js + config.files.scriptsSource;
let outputPath = rootPath + config.paths.sources + config.paths.temp + config.dirs.js;
let outputFilename = config.files.scriptsResults;
let cleanPath = rootPath + config.paths.results + config.dirs.js;
let scssVariablesPath = rootPath + config.paths.sources + config.dirs.sass + config.webpack.scssVariables;
let globalsPath = rootPath + config.paths.sources + config.dirs.twig + config.files.twigGlobals;

let globals = require(globalsPath);
let webPackDevCompiler = null;

function webpackConfig(isProduction) {
    let baseConfig = {
        devtool: isProduction ? 'source-map' : 'eval',
        cache: !isProduction,
        context: rootPath,
        externals: {
            scss: JSON.stringify(scssToJson(scssVariablesPath)),
            globals: JSON.stringify(globals)
        },
        node: {
            fs: 'empty' // Żeby twig się nie czepiał o brak modułu fs
        },
        resolve: {
            alias: {
                sources: sourcesPath, // Żeby nie pisać relatywnych ścieżek
                '@node-modules': rootPath + config.dirs.nodeModules,
                '@js': sourcesPath + config.dirs.js // alias do katalogu sources/js
            }
        },
        // Czasem wywala builda :)
        // Problem lezy zapisie/odczycie pliku
        // Powstały bufor jest niepoprawny
        // Nie stosować!
        //recordsPath: paths.assetsDir + '/recordsPath.json',
        watch: false, // Bo korzystamy z watchera gulpowego
        plugins: [
            // Usuwa wcześniej generowane chunki z temp
            new CleanObsoleteChunks(),
            // Czyści katalog wynikowy w dist
            new CleanWebpackPlugin([cleanPath], {
                verbose: false,
                dry: false,
                watch: true,
                root: rootPath
            })
        ].concat(isProduction ? [
            // Minifikuje kod
            new webpack.optimize.UglifyJsPlugin({
                sourceMapFilename: getFilename(outputFilename, isProduction) + '.map',
                sourceMap: true,
                compress: {
                    pure_funcs: ['console.log', 'debugger', 'debug']
                }
            }),
            // Tworzy raport z wielkości paczki
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'report.html',
                openAnalyzer: false,
                logLevel: 'silent'
            }),
            // Gzippuje bundla - warto zerknąć jaką ma wielkość po gzippowaniu
            new CompressionPlugin({
                asset: '[path].gz',
                algorithm: 'gzip',
                test: /\.(js)$/,
                threshold: 10240,
                minRatio: 0.8
            }),
            // Zmienne globalne (istotne dla reactowych buildow produkcyjnych)
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(true),
                VERSION: JSON.stringify('5fa3b9'),
                BROWSER_SUPPORTS_HTML5: true,
                TWO: '1+1',
                'typeof window': JSON.stringify('object'),
                'process.env.NODE_ENV': JSON.stringify('production')
            })
        ] : [
            new webpack.LoaderOptionsPlugin({
                debug: config.webpack.showPolyfills
            })
        ]),
        module: {
            rules: [
                {
                    test: /\.mp3$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                name: '[name]-[hash:4].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.twig$/,
                    use: [
                        {
                            loader: 'twig-loader'
                        }
                    ]
                },
                {
                    test: /\.dot/,
                    use: [
                        {
                            loader: 'dot-loader'
                        }
                    ]
                },
                {
                    test: /\.(jpg|png|gif)/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                name: '[name]-[hash:4].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|svg)/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name]-[hash:4].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components|js\/vendor)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [['env', {
                                    targets: {
                                        browsers: ['last 2 versions', 'ie >= 11', 'safari >= 9']
                                    },
                                    useBuiltIns: 'usage',
                                    debug: config.webpack.showPolyfills
                                }], 'react', 'stage-2'],
                                plugins: [
                                    'syntax-dynamic-import', // webpackowy codesplitting
                                    'transform-runtime',
                                    'transform-class-properties'
                                ],
                                cacheDirectory: true
                            }
                        }
                    ]
                }
            ]
        }
    };


    return Object.assign({}, baseConfig, {
        name: config.webpack.name,
        entry: [
            entryPath
        ],
        output: {
            path: outputPath,
            filename: getFilename(outputFilename, isProduction),
            chunkFilename: config.webpack.chunksName,
            publicPath: config.webpack.publicPath
        }
    });
}

function webpackLog(err, stats, resolve, reject) {
    if (err) {
        reject(new util.PluginError('webpack', err));
    }
    if(config.webpack.showAssets) {
        util.log(stats.toString({
            assets: true,
            colors: true,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: false,
            cached: false,
            reasons: false,
            source: false,
            errorDetails: false,
            chunkOrigins: false,
            modulesSort: false,
            chunksSort: false,
            assetsSort: false,
            warnings: false,
            exclude: ['core-js', 'babel-runtime', 'babel-polyfill', 'babel-regenerator-runtime']
        }));
    }
    resolve();
}

function webpackTask(isProduction) {
    if (isProduction || !webPackDevCompiler) {
        webPackDevCompiler = webpack(webpackConfig(isProduction));
    }

    return new Promise((resolve, reject) => {
        webPackDevCompiler.run(function(err, stats) {
            webpackLog(err, stats, resolve, reject);
        });
    });
}

module.exports = webpackTask;
