import React from 'react';
import ReactDOM from 'react-dom';
import Icon from 'foremanReact/common/Icon';

const reactNode = document.querySelector('#content');

console.log(reactNode);
if (reactNode) {
    ReactDOM.render(
        <p>React App!</p>,
    reactNode);
};