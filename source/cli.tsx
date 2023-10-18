#!/usr/bin/env node
import dotenv from 'dotenv';
import { render } from 'ink';
import React from 'react';
import App from './app.js';

dotenv.config();

console.clear();
render(<App />);
