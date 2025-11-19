import React from "react";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import style from './index.module.scss';

const headLab = [
  {
    label: '首页',
    value: 'home',
    link: '/',
  },
  {
    label: '活动',
    value: 'activity',
    link: '/activity/33',
  },
  {
    label: 'ai使用',
    value: 'auth',
    link: '/auth',
  },
  {
    label: '工具推荐',
    value: 'tools',
    link: '/tools',
  },
  {
    label: '文章',
    value: 'articles',
    link: '/articles',
  }
];

const Header = () => {
  const pathname = usePathname();

  const getActiveIndex = () => {
    const index = headLab.findIndex(item => {
      if (item.link === '/') {
        return pathname === '/';
      }
      return pathname === item.link || pathname.startsWith(item.link + '/');
    });
    return index < 0 ? 0 : index;
  };

  const activeIndex = getActiveIndex();

  return (
    <header className={style['main-header']}>
      <div className={style['main-header-container']}>
        {/* <img src="aa" /> */}
        <nav className={style.mainNav}>
          <div className={style.navList}>
            <ul className={style.navListLeft}>
              {
                headLab.map((item, index) => (
                  <Link
                    className={`${style.navListItem} ${activeIndex === index ? style.navListItemActive : ''}`}
                    key={item.value}
                    href={item.link}
                  >
                    {item.label}
                  </Link>
                ))
              }
            </ul>
            <ul className={style.navListRight}>
              <li style={{ marginRight: 10 }}>tangbei</li>
              <li>
                <a href="https://github.com/tangbei" target="_blank" rel="noopener noreferrer">
                  <Image src='/images/icon_github.svg' width="24" height="24" alt="github" />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;