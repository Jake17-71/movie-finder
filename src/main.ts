import './styles/styles.scss'
import ThemeChange from './modules/ThemeChange'
import TabsCollection from '@/modules/TabsCollection'
import SearchController from '@/modules/SearchController'
import Modals from '@/modules/Modals'

new ThemeChange()
new TabsCollection()
const modals = new Modals()
const searchForm = new SearchController(modals)
modals.searchForm = searchForm
