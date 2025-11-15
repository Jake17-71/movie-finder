import './styles/styles.scss'
import ThemeChange from './modules/ThemeChange.js'
import TabsCollection from '@/modules/TabsCollection.js'
import SearchForm from '@/modules/SearchForm.js'
import Modals from '@/modules/Modals.js'

new ThemeChange()
new TabsCollection()
const modals = new Modals()
const searchForm = new SearchForm(modals)
modals.searchForm = searchForm