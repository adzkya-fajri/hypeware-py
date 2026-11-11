import { initCollection, loadFooter } from './collection-core.js';
import { dataWanita } from './colectiondata/all-products.js';

loadFooter();
document.addEventListener('DOMContentLoaded', function () {
  initCollection({ gender: 'wanita', data: dataWanita });
});
