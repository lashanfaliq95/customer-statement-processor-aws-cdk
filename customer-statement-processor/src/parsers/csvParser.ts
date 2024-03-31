import {parse} from 'csv-parse';

const parser = parse({delimiter: ',', from_line: 2});

export default parser;
