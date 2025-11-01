import { X as attr_class, W as attr, Y as store_get, Z as unsubscribe_stores, _ as ensure_array_like } from "../../chunks/index2.js";
import { w as writable } from "../../chunks/index.js";
import { e as escape_html } from "../../chunks/context.js";
import "clsx";
import "marked";
function html(value) {
  var html2 = String(value);
  var open = "<!---->";
  return open + html2 + "<!---->";
}
const selectedMenu = writable(null);
const rows = writable([]);
function HeaderMenu($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<div class="header-menu svelte-jwvxbk" role="navigation" aria-label="ヘッダーメニュー"><button${attr_class("menu-btn svelte-jwvxbk", void 0, {
      "active": store_get($$store_subs ??= {}, "$selectedMenu", selectedMenu) === "new"
    })} type="button">新規作成</button> <button${attr_class("menu-btn svelte-jwvxbk", void 0, {
      "active": store_get($$store_subs ??= {}, "$selectedMenu", selectedMenu) === "load"
    })} type="button">ファイル読み込み</button> <button${attr_class("menu-btn svelte-jwvxbk", void 0, {
      "active": store_get($$store_subs ??= {}, "$selectedMenu", selectedMenu) === "manual"
    })} type="button">マニュアル</button> <button class="menu-btn svelte-jwvxbk" type="button">クリア</button> <button${attr_class("menu-btn svelte-jwvxbk", void 0, {
      "active": store_get($$store_subs ??= {}, "$selectedMenu", selectedMenu) === "save"
    })}${attr("disabled", store_get($$store_subs ??= {}, "$rows", rows).length === 0, true)} type="button">保存</button></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function HeaderNewFile($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let newRowCount = 3;
    let newColCount = 3;
    $$renderer2.push(`<div class="form svelte-1gsgfnb" role="region" aria-label="新規作成フォーム"><label class="svelte-1gsgfnb">行数: `);
    $$renderer2.select({ value: newRowCount }, ($$renderer3) => {
      $$renderer3.push(`<!--[-->`);
      const each_array = ensure_array_like(Array(50).fill(0).map((_, i) => i + 1));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let n = each_array[$$index];
        $$renderer3.option({ value: n }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(n)}`);
        });
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`</label> <label class="svelte-1gsgfnb">列数: `);
    $$renderer2.select({ value: newColCount }, ($$renderer3) => {
      $$renderer3.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(Array(50).fill(0).map((_, i) => i + 1));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let n = each_array_1[$$index_1];
        $$renderer3.option({ value: n }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(n)}`);
        });
      }
      $$renderer3.push(`<!--]-->`);
    });
    $$renderer2.push(`</label> <button type="button">新規作成</button></div>`);
  });
}
function HeaderLoadFile($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let loadFileType = "CSV";
    let loadLfCode = "LF";
    $$renderer2.push(`<div class="form svelte-1t188ul" role="region" aria-label="ファイル読み込みフォーム"><label class="svelte-1t188ul">ファイル形式: `);
    $$renderer2.select({ value: loadFileType }, ($$renderer3) => {
      $$renderer3.option({ value: "CSV" }, ($$renderer4) => {
        $$renderer4.push(`CSV`);
      });
      $$renderer3.option({ value: "TSV" }, ($$renderer4) => {
        $$renderer4.push(`TSV`);
      });
      $$renderer3.option({ value: "JSON" }, ($$renderer4) => {
        $$renderer4.push(`JSON`);
      });
    });
    $$renderer2.push(`</label> <label class="svelte-1t188ul">改行コード: `);
    $$renderer2.select({ value: loadLfCode, disabled: loadFileType === "JSON" }, ($$renderer3) => {
      $$renderer3.option({ value: "LF" }, ($$renderer4) => {
        $$renderer4.push(`LF`);
      });
      $$renderer3.option({ value: "CRLF" }, ($$renderer4) => {
        $$renderer4.push(`CR+LF`);
      });
      $$renderer3.option({ value: "CR" }, ($$renderer4) => {
        $$renderer4.push(`CR`);
      });
    });
    $$renderer2.push(`</label> <label class="svelte-1t188ul">ファイル: <input type="file" accept=".csv,.tsv,.json"/></label> <button type="button">読み込み</button></div>`);
  });
}
function HeaderClearData($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="form svelte-1ocpd9o" role="region" aria-label="データクリア"><button class="danger svelte-1ocpd9o" type="button">データクリア</button></div>`);
  });
}
function HeaderSaveFile($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let saveFileType = "CSV";
    let saveLfCode = "LF";
    if (store_get($$store_subs ??= {}, "$rows", rows).length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="form svelte-110srqk" role="region" aria-label="ファイル保存フォーム"><label class="svelte-110srqk">ファイル形式: `);
      $$renderer2.select({ value: saveFileType }, ($$renderer3) => {
        $$renderer3.option({ value: "CSV" }, ($$renderer4) => {
          $$renderer4.push(`CSV`);
        });
        $$renderer3.option({ value: "TSV" }, ($$renderer4) => {
          $$renderer4.push(`TSV`);
        });
        $$renderer3.option({ value: "JSON" }, ($$renderer4) => {
          $$renderer4.push(`JSON`);
        });
      });
      $$renderer2.push(`</label> <label class="svelte-110srqk">改行コード: `);
      $$renderer2.select({ value: saveLfCode, disabled: saveFileType === "JSON" }, ($$renderer3) => {
        $$renderer3.option({ value: "LF" }, ($$renderer4) => {
          $$renderer4.push(`LF`);
        });
        $$renderer3.option({ value: "CRLF" }, ($$renderer4) => {
          $$renderer4.push(`CR+LF`);
        });
        $$renderer3.option({ value: "CR" }, ($$renderer4) => {
          $$renderer4.push(`CR`);
        });
      });
      $$renderer2.push(`</label> <button type="button">保存 (ダウンロード)</button></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function DataTable($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<table border="1" cellpadding="4" cellspacing="0" class="svelte-16k18c8"><thead>`);
    if (store_get($$store_subs ??= {}, "$rows", rows).length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<tr><!--[-->`);
      const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$rows", rows)[0]);
      for (let colIdx = 0, $$length = each_array.length; colIdx < $$length; colIdx++) {
        each_array[colIdx];
        $$renderer2.push(`<th class="svelte-16k18c8">列 ${escape_html(colIdx + 1)} <div style="margin-top:4px;">`);
        if (colIdx === 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button class="svelte-16k18c8">＋</button>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <button class="svelte-16k18c8">＋</button> <button class="svelte-16k18c8">-</button> <button class="svelte-16k18c8">N</button> <button class="svelte-16k18c8">C</button></div></th>`);
      }
      $$renderer2.push(`<!--]--><th class="svelte-16k18c8">行操作</th></tr>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></thead><tbody><!--[-->`);
    const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$rows", rows));
    for (let rowIdx = 0, $$length = each_array_1.length; rowIdx < $$length; rowIdx++) {
      let row = each_array_1[rowIdx];
      $$renderer2.push(`<tr><!--[-->`);
      const each_array_2 = ensure_array_like(row);
      for (let colIdx = 0, $$length2 = each_array_2.length; colIdx < $$length2; colIdx++) {
        let cell = each_array_2[colIdx];
        $$renderer2.push(`<td class="svelte-16k18c8"><input type="text"${attr("value", cell)} style="width:100%; box-sizing:border-box;" class="svelte-16k18c8"/></td>`);
      }
      $$renderer2.push(`<!--]--><td class="svelte-16k18c8">`);
      if (rowIdx === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<button class="svelte-16k18c8">＋</button>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <button class="svelte-16k18c8">＋</button> <button class="svelte-16k18c8">-</button> <button class="svelte-16k18c8">N</button> <button class="svelte-16k18c8">C</button></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function ManualViewer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let html$1 = "";
    $$renderer2.push(`<div class="manual-wrapper svelte-1g5cb1r">${html(html$1)}</div>`);
  });
}
function _page($$renderer) {
  var $$store_subs;
  $$renderer.push(`<main class="svelte-1uha8ag"><h1 class="svelte-1uha8ag">Web Data Editor</h1> <div class="header-container svelte-1uha8ag">`);
  HeaderMenu($$renderer);
  $$renderer.push(`<!----> `);
  if (store_get($$store_subs ??= {}, "$selectedMenu", selectedMenu) === "new") {
    $$renderer.push("<!--[-->");
    HeaderNewFile($$renderer);
  } else {
    $$renderer.push("<!--[!-->");
    if (store_get($$store_subs ??= {}, "$selectedMenu", selectedMenu) === "load") {
      $$renderer.push("<!--[-->");
      HeaderLoadFile($$renderer);
    } else {
      $$renderer.push("<!--[!-->");
      if (store_get($$store_subs ??= {}, "$selectedMenu", selectedMenu) === "clear") {
        $$renderer.push("<!--[-->");
        HeaderClearData($$renderer);
      } else {
        $$renderer.push("<!--[!-->");
        if (store_get($$store_subs ??= {}, "$selectedMenu", selectedMenu) === "save") {
          $$renderer.push("<!--[-->");
          HeaderSaveFile($$renderer);
        } else {
          $$renderer.push("<!--[!-->");
        }
        $$renderer.push(`<!--]-->`);
      }
      $$renderer.push(`<!--]-->`);
    }
    $$renderer.push(`<!--]-->`);
  }
  $$renderer.push(`<!--]--></div> `);
  if (store_get($$store_subs ??= {}, "$selectedMenu", selectedMenu) === "manual") {
    $$renderer.push("<!--[-->");
    ManualViewer($$renderer);
  } else {
    $$renderer.push("<!--[!-->");
    DataTable($$renderer);
  }
  $$renderer.push(`<!--]--></main>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
}
export {
  _page as default
};
