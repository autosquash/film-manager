import { useTranslation } from 'react-i18next'
import styles from '../css/Settings.module.css'

interface Props {
  close: () => void
}

export default function LanguageSwitcher({ close }: Props) {
  const { i18n, t } = useTranslation()

  const switchToSpanish = () => {
    i18n.changeLanguage('es')
  }
  const switchToEnglish = () => {
    i18n.changeLanguage('en')
  }
  return (
    <div className={styles.container}>
      <h3>{t('chooseLang')}</h3>
      <div className={styles.buttonsContainer}>
        <button className={styles.button} onClick={switchToSpanish}>
          {t('spa')}
        </button>
        <button className={styles.button} onClick={switchToEnglish}>
          {t('eng')}
        </button>
      </div>
      <button className={styles.button} onClick={close}>
        {t('back')}
      </button>
    </div>
  )
}
