
const dom = document.querySelector('#elem-list');

let hasInited = false;

export function doElemens(core) {
  if (hasInited === true)  return;
  renderElemens(core);
  listenElements(core);
}

function renderElemens(core) {
  const data = core.getData();
  const elems = data.elements;
  const items = [];
  for (let i = elems.length - 1; i >= 0; i --) {
    const ele = elems[i];
    items.push(`
    <div class="elem-item">
      <span class="elem-item-name" data-elem-name="${ele.uuid || ''}">${ele.name || 'Unnamed'}</span>
      <span class="elem-item-btn ${i === elems.length - 1 ? 'btn-hidden' : ''}" data-elem-btn-up="${ele.uuid || ''}">Up</span>
      <span class="elem-item-btn ${i === 0 ? 'btn-hidden' : ''} " data-elem-btn-down="${ele.uuid || ''}">Down</span>
    </div>
    `);
  }
  dom.innerHTML = items.join('');
}

function listenElements(core) {

  dom.addEventListener('click', (e) => {
    if (!e.path[0]) {
      return;
    }
    const el = e.path[0];
    if (el.hasAttribute('data-elem-name')) {
      const uuid = el.getAttribute('data-elem-name');
      core.selectElementByUUID(uuid);
    } else if (el.hasAttribute('data-elem-btn-up')) {
      const uuid = el.getAttribute('data-elem-btn-up');
      core.moveUpElement(uuid);
      renderElemens(core);
    } else if (el.hasAttribute('data-elem-btn-down')) {
      const uuid = el.getAttribute('data-elem-btn-down');
      core.moveDownElement(uuid);
      renderElemens(core);
    }
  }, true);

}
