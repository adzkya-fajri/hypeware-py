import { initCollection, loadFooter } from './collection-core.js';
import { dataPria } from './colectiondata/all-products.js';

loadFooter();
document.addEventListener('DOMContentLoaded', function () {
  initCollection({ gender: 'pria', data: dataPria });
});
