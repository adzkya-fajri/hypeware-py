import { initCollection, loadFooter } from './collection-core.js';
import { dataBayi } from './colectiondata/all-products.js';

loadFooter();
document.addEventListener('DOMContentLoaded', function () {
  initCollection({ gender: 'bayi', data: dataBayi });
});
