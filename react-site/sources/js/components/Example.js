import React from 'react';
import { connect } from 'react-redux';

const Example = (props) => {
    return (
        <h1>My first component ever: {props.name}</h1>
    );
};

const mapStateToProps = (state) => {
    return {
        name: state.example.name
    }
};

export default connect(mapStateToProps)(Example);