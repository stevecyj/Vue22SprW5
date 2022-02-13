# Vue22SprW5

- [page](https://stevecyj.github.io/Vue22SprW5/login.html)

## Delete Modal

<details>

<summary>Click to expand!</summary>

```
      <div
        aria-hidden="true"
        aria-labelledby="delProductModalLabel"
        class="modal fade"
        id="delProductModal"
        ref="delProductModal"
        tabindex="-1"
      >
        <div class="modal-dialog">
          <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
              <h5 class="modal-title" id="delProductModalLabel">
                <span>刪除產品</span>
              </h5>
              <button aria-label="Close" class="btn-close" type="button" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              是否刪除
              <!-- 產品名稱 -->
              <strong class="text-danger">{{singleProduct.title}}</strong> 商品(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline-secondary" type="button" data-bs-dismiss="modal">取消</button>
              <button @click="delProduct" class="btn btn-danger" type="button">確認刪除</button>
            </div>
          </div>
        </div>
      </div>
```

</details>
