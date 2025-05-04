import { useTranslation } from 'react-i18next'
import styles from '../css/Settings.module.css'

interface Props {
  close: () => void
}

export default function LanguageSwitcher({ close }: Props) {
  const { i18n, t } = useTranslation()

  const switchToSpanish = () => {
    i18n.changeLanguage('es')
    close()
  }
  const switchToEnglish = () => {
    i18n.changeLanguage('en')
    close()
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 100,
      }}
    >
      <h3>{t('chooseLang')}</h3>
      <div className={styles.container}>
        <button className={styles.button} onClick={switchToSpanish}>
          {t('spa')}
        </button>
        <button className={styles.button} onClick={switchToEnglish}>
          {t('eng')}
        </button>
      </div>
    </div>
  )
}
