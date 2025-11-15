import './styles/styles.scss'
import ThemeChange from './modules/ThemeChange.js'
import TabsCollection from '@/modules/TabsCollection.js'
import SearchController from '@/modules/SearchController.js'
import Modals from '@/modules/Modals.js'

new ThemeChange()
new TabsCollection()
const modals = new Modals()
const searchForm = new SearchController(modals)
modals.searchForm = searchForm