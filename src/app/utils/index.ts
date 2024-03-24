export const activeSection = () => {
  window?.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.pp-section');
    const navLi = document.querySelectorAll('.nav-menu li');
    let current = '';
    sections.forEach((section) => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const sectionHeight = (section as HTMLElement).clientHeight;
      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id') || '';
      }
    });
    navLi.forEach((li) => {
      li.classList.remove('active');
      if (
        li.getElementsByTagName('a')[0].getAttribute('href') == `#${current}`
      ) {
        li.classList.add('active');
      }
    });
  });
};
