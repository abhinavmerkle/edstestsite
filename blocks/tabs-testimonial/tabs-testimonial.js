// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-testimonial-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // Get panel content cell (second div) for avatar extraction
    const contentCell = tabpanel.children[1] || tabpanel.children[0];
    const panelImg = contentCell ? contentCell.querySelector('img') : null;
    const panelStrong = contentCell ? contentCell.querySelector('strong') : null;

    // Find role text: the <p> after the strong's <p>
    let roleText = '';
    if (panelStrong) {
      const strongP = panelStrong.closest('p');
      const roleP = strongP ? strongP.nextElementSibling : null;
      if (roleP && !roleP.querySelector('picture') && !roleP.querySelector('strong')) {
        roleText = roleP.textContent;
      }
    }

    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;

    // Build tab button with avatar, name, and role
    const tabInner = document.createElement('div');
    tabInner.className = 'tabs-testimonial-tab-inner';

    if (panelImg) {
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'tabs-testimonial-avatar';
      const avatarImg = document.createElement('img');
      avatarImg.src = panelImg.src;
      avatarImg.alt = panelImg.alt || '';
      avatarImg.loading = 'lazy';
      avatarDiv.append(avatarImg);
      tabInner.append(avatarDiv);
    }

    const textDiv = document.createElement('div');
    textDiv.className = 'tabs-testimonial-tab-text';
    const nameDiv = document.createElement('div');
    nameDiv.className = 'tabs-testimonial-tab-name';
    nameDiv.textContent = tab.textContent;
    textDiv.append(nameDiv);

    if (roleText) {
      const roleDiv = document.createElement('div');
      roleDiv.className = 'tabs-testimonial-tab-role';
      roleDiv.textContent = roleText;
      textDiv.append(roleDiv);
    }

    tabInner.append(textDiv);
    button.append(tabInner);

    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  block.append(tablist);
}
