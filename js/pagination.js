export default {
  props: ['pages'],
  template: `
      <nav aria-label='Page navigation example'>
        <ul class='pagination'>
        <!-- 前一頁 啟用禁用 -->
          <li class='page-item' :class="{ disabled: !pages.has_pre}">
            <a class='page-link' href='#' aria-label='Previous'>
              <span aria-hidden='true'>&laquo;</span>
            </a>
          </li>
          <!-- 頁碼 start，當前頁 class active -->
          <li class='page-item' :class="{ active: page===pages.current_page }"
          v-for="page in pages.total_pages" :key="page + 'page'">
            <a class='page-link' href='#'>
              {{ page }}
            </a>
          </li>
          <!-- 下一頁 啟用禁用 -->
          <li class='page-item' :class="{ disabled: !pages.has_next}">
            <a class='page-link' href='#' aria-label='Next'>
              <span aria-hidden='true'>&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
  `,
};
