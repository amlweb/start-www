# K2 - front-end boilerplate with webpack

## Zasady i ogólne wytyczne

Projekt boilerplate jest startową paczką plików, które stanowią komplet potrzebnych materiałów do rozpoczęcia pracy nad nowym projektem. Narzuca on strukture katalogów, której należy się trzymać oraz podział aplikacji zgodny z [wzorcem 7-1](https://sass-guidelin.es/pl/#wzr-7-1).

Ogólne wytyczne

- Boilerplate może ewoluować i zmieniać swój kształt, to nie jest wersja ostateczna i zakończona w 100%, i nigdy nie będzie.
- Jeżeli występuje taka potrzeba, odgórne założenia lub pliki gulpa można modyfikować wedle własnej potrzeby. Boilerplate powinien zapewniać wszystkie potrzebne rzeczy dla małych i średnich projektów - w przypadku dużych prawdopodobnie będzie wymagał modyfikacji per projekt.

## Sposób użycia

### Wymagania

- Node.js w wersji 6.2.2 lub wyższej

### Instalacja

Aby rozpocząć pracę z boilerplatem należy kolejno:

- Zaciągnąć lub zaktualizować projekty [front-end-boilerplate](https://gitlab.k2.pl/k2/front-end-boilerplate) i [front-end-styleguide](https://gitlab.k2.pl/k2/front-end-styleguide).
- Do głównego katalogu nowo założonego projektu skopiować:
  - Z projektu **front-end-boilerplate** wszystko za wyjątkiem pliku __README.md__.
  - Z projektu **front-end-styleguide** pliki __.eslintrc__ i __.scss-lint.yml__.
- W głównym katalogu nowo założonego projektu uruchomić komendę `npm install`.
- Jeśli potrzebne, skonfigurować plik __/gulp/config.json__ wedle własnych potrzeb.
- Zacommitować wszystkie zmiany jako **boilerplate init**.

### Praca z boilerplatem

Boilerplate wymusza na użytkowniku następujące rzeczy

- Korzystanie z javascriptu w wersji [ECMAScript 6](https://github.com/DrkSephy/es6-cheatsheet).
- [Modularny](https://github.com/DrkSephy/es6-cheatsheet#modules) javascript z wykorzystaniem [importów i eksportów](https://github.com/DrkSephy/es6-cheatsheet#importing-in-es6).
- Korzystanie z Sassa.
- Zachęca do wykorzystywania Twiga do pisania htmli.
- Podział plików zgodnie z [wzorcem 7-1](https://sass-guidelin.es/pl/#wzr-7-1). Podział tyczy się nie tylko plików scss, ale także js i twig.

### Gulp

#### Zadania

Domyślnie gulp zapewnia następujące rzeczy:

- Transpilacja kodu ES6 do interpretowalnego przez starsze przeglądarki.
- Kompilacja plików sassa i automatyczne dodanie prefiksów dla starszych przeglądarek.
- Kompilacja twiga.
- Bezstratna kompresja obrazów.
- Minifikacja i obfuskacja kodu.

Dostępne są dwie metody, dzięki którym można to osiągnąć:

- `gulp build:dev` - odpalenie buildu developerskiego, który w celu przyspieszenia pracy pomija kompresowanie plików i uruchamia watcher.
- `gulp build:production` - odpalenie buildu produkcyjnego, który kompresuje wszystkie pliki i czyści środowisko z nieużywanych plików powstałych w czasie developmentu.

#### Konfiguracja

Konfiguracja gulpa odbywa się poprzez plik __/gulp/config.json__.

|**grupa**|**opcja**|**typ**|**domyślna wartość**|**działanie**|
|---------|---------|-------|--------------------|-------------|
|paths|root|__string__|"../"|Względna ścieżka od pliku __/gulp/config.json__ do roota projektu|
|paths|sources|__string__|"sources/"|Bezwzględna ścieżka do katalogu z plikami źródłowymi|
|paths|results|__string__|"public/"|Bezwzględna ścieżka do katalogu z plikami wynikowymi|
|paths|temp|__string__|"_temp/"|Nazwa katalogu z plikami tymczasowymi|
|dirs|css|__string__|"css/"|Nazwa katalogu z plikami css|
|dirs|sass|__string__|"sass/"|Nazwa katalogu z plikami scss|
|dirs|js|__string__|"js/"|Nazwa katalogu z plikami js|
|dirs|img|__string__|"img/"|Nazwa katalogu z obrazkami|
|dirs|html|__string__|"html/"|Nazwa katalogu z plikami html|
|dirs|twig|__string__|"templates/"|Nazwa katalogu z szablonami|
|dirs|exclude|__string__|"vendors/"|Nazwa katalogu, w którym znajdują się pliki vendorowe|
|files|scriptsSource|__string__|"main.js"|Nazwa głównego źródłowego pliku ze skryptami|
|files|scriptsResults|__string__|"scripts.js"|Nazwa wynikowego pliku ze skryptami|
|files|stylesSource|__string__|"main.scss"|Nazwa głównego źródłowego pliku ze stylami|
|files|stylesResults|__string__|"styles.css"|Nazwa wynikowego pliku ze stylami|
|files|twigGlobals|__string__|"_globals.json"|Nazwa pliku z dodatkową konfiguracją do szablonów twigowych|
|settings|twig|__boolean__|true|Określa czy strona korzysta z szablonów twigowych|
|settings|constFilenames|__boolean__|false|Określa czy pliki wynikowe powinny mieć zmieniane nazwy w zależności od tego czy są kompresowane czy nie|
|webpack|name|__string__|"main"|Nazwa bundla - tylko kwestia estetyczna|
|webpack|chunksName|__string__|"[name].[chunkhash].chunk.js"|Format nazwy generowanego chunka|
|webpack|scssVariables|__string__|"utils/_variables.scss"|Ścieżka do pliku ze zmiennymi scss|
|webpack|publicPath|__string__|"/js/"|Gdzie lądują pliki na serwerze z punktu widzenia klienta relatywnie do katalogu public|

### Korzystanie z modułów publikowanych na npmie.

Odchodzimy od trzymania zewnętrznych pluginów i bibliotek luzem w katalogach projektu. Takie pliki, zamiast być wrzucane do katalogu vendor, powinny zostać zaciągane z [npm](https://www.npmjs.com/). Wprowadza to większy porządek w projekcie i ułatwia zarządznie i odzielenie kodu przychodzącego z zewnątrz od własnego kodu.

#### jQuery

W boilerplate już znajduje się jquery. Jest przypisane do globalnego scop'a oraz jest widoczne w modułach. W każdym z tych miejsc występuje jako zmienna __$__ lub __jQuery__. Uzasadnione jest to tym że niektóre pluginy wymagają jQuery$ w window.

#### Przykład

Aby skorzystać w projekcie moment.js należy kolejno:

- W [wyszukiwarce](https://www.npmjs.com/search) paczek na stronie npm odnaleźć [moment](https://www.npmjs.com/package/moment).
- Zainstalować przy pomocy komendy `npm install moment --save`. Koniecznie należy pamiętać o parametrze `--save`, dzięki niemu informacja o zainstalowanej paczce trafi do pliku __package.json__.
- Zaimportować plugin na górze pliku js, w którym chcemy z niego skorzystać. W przypadku przykładowego moment import wygląda następująco:

```js
import moment from 'moment'
```

- Plugin zaimportowany w ten sposób dostepny jest jedynie w obrębie pliku, w którym został zaimportowany. Nie trafia do obiektu `window` i globalnych zmiennych. Jeżeli ma być wykorzystywany w więcej niż jednym pliku, w każdym należy zaimportować go oddzielnie.

#### A co, jeśli nie ma na npmie pluginu, którego potrzebuję użyć?

Znajdź alternatywny, użyj czegoś innego, napisz własny.

#### Ale ja NAPRAWDĘ potrzebuję go użyć...

Jeżeli nie ma innej możliwości, istnieje możliwość skorzystania z pluginu, którego nie ma na npmie. W tym celu plik js należy umieścić w folderze __/sources/js/vendors/__. Pliki z tego katalogu są łączone w jeden plik ze skryptami projektowymi. Nie należy ich importować, są dodawane bezpośrednio do obieku `window`. Metoda ta jest bardzo mocno odradzana.

__UWAGA:__ Jeśli w katalogu __vendors__ znajdują się pluginy będące zależne od innych bibliotek (np. pluginy do jQuery), to je również należy umieścić w katalogu __vendors__ zamiast importować je z npma.

### Webpack

W tej wersji boilerplate wykorzystuje webpacka zamiast browserify. Dzięki temu dostępne są poniższe możliwości.

#### Zmienne scss dostępne w js

Aby skorzystać ze zmiennych scss w js należy zaimportować moduł scss i wywołać go z odpowiednim kluczem.

```js
import scss from 'scss';

console.log(scss['$color-black']); // #000
```

#### Obsługa importu różnych rodzajów plików

Przykładowo import pliku twig w js będzie skutkować zwróceniem skompilowanego szablonu gotowego do przyjęcia danych.

Dla szablonu:
```html
<!--example.twig-->
<div>{{ test }}</div>
```

Import i wywołanie wygląda tak:
```js
import exampleTemplate from 'sources/templates/components/example.twig';

console.log(exampleTemplate({
    test: 'aaaa'
})); // <div>aaaa</div>
```

#### Dynamiczny import

Zdarza się tak że w projekcie chcemy wydzielić fragment aby ładował się asynchronicznie po wykonaniu akcji. W webpacku można to zrobić za pomocą [dynamicznego importu](https://webpack.js.org/api/module-methods/#import-).

Przykładowy komponent importowany dynamicznie wygląda tak:

```js
// Zwróc uwagę na brak importu modułu Component na początku
class App {
    constructor() {
        this.init();
    }

    init() {
        import(/* webpackChunkName: "component-chunk-name" */ 'sources/js/components/component').then((Component) => {
            let component = new Component();

            component.printMessage();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new App());

```

W logach webpacka pojawia się chunk który ładowany jest później automatycznie asynchronicznie
```bash
                                             Asset     Size  Chunks             Chunk Names
component-chunk-name.363cb568ef6c0ddca546.chunk.js  1.13 kB       0  [emitted]  component-chunk-name
                                        scripts.js  21.3 kB       1  [emitted]  main
```

Dynamiczny import zwraca Promise a to oznacza że można użyć async/await.

```js
// Zwróc uwagę na brak importu modułu Component na początku
class App {
    constructor() {
        this.init();
    }

    async init() {
        let Component = (await import(/* webpackChunkName: "component-chunk-name" */ 'sources/js/components/component')).default;

        let component = new Component();

        component.printMessage();
    }
}

document.addEventListener('DOMContentLoaded', () => new App());

```

#### Aliasy importów

Standardowo pozwalają na import modułów za pomocą ścieżki zawsze relatywnej do katalogu projektu i używanie "Copy Reference" w menu kontekstowym PHPStorma.

Przykład importu przykładowego modułu z użyciem aliasu:

```js
// Zwróć uwagę na ścieżkę która wygląda jak ścieżka absolutna
import Component from 'sources/js/components/component';
```



