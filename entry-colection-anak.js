import { initCollection, loadFooter } from './collection-core.js';
import { dataAnak } from './colectiondata/all-products.js';

loadFooter();
document.addEventListener('DOMContentLoaded', function () {
  initCollection({ gender: 'anak', data: dataAnak });
});
