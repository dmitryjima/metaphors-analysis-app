import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';



import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

const availableLanguages = [
  'en',
  'ru',
  'zh'
]

export default function ChangeLanguageMenu() {
  const { t, i18n, ready } = useTranslation('changeLanguageMenu');

  let location = useLocation();


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button 
        aria-controls="change-language-menu" 
        aria-haspopup="true" 
        onClick={handleClick}
        style={{
          color: 'white'
        }}
      >
        {t(`title`)}
      </Button>
      <Menu
        id="change-language-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {
          availableLanguages.map(lang => (
            <MenuItem 
              key={lang}
              onClick={handleClose}
            >
              <a
                style={{
                  textDecoration: `none`,
                  color: `inherit`
                }}
                href={`/${lang}${location.pathname}`}
              >
                {t(`languages.${lang}`)}
              </a>
            </MenuItem>
          ))
        }
      </Menu>
    </div>
  );
}