import Categories from '@/components/shop/Categories'
import ItemsList from '@/components/shop/ItemsList'
import Item from '@/components/shop/Item'
import ThanksMessage from '@/components/shop/ThanksMessage'
import TopBar from '@/components/shop/TopBar'
import i18n from '@/config/i18n'

const shopRoutes = [
  {
    name: 'Shop',
    path: '',
    components: {
      content: Categories,
      top: TopBar
    },
    props: {
      top: (route) => ({title: i18n.t('components.shop.categories.topbar')})
    }
  }, {
    name: 'ShopCategory',
    path: 'category/:categoryId',
    components: {
      top: TopBar,
      content: ItemsList
    },
    props: {
      content: (route) => ({ categoryId: route.params.categoryId }),
      top: (route) => ({ categoryId: route.params.categoryId })
    }
  }, {
    name: 'ShopItem',
    path: 'item/:itemId',
    components: {
      top: TopBar,
      content: Item
    },
    props: {
      content: (route) => ({ itemId: route.params.itemId }),
      top: (route) => ({ itemId: route.params.itemId })
    }
  }, {
    name: 'ShopThanksMessage',
    path: 'thanks',
    components: {
      top: TopBar,
      content: ThanksMessage
    },
    props: {
      content: (route) => ({ itemId: route.query.itemId, categoryId: route.query.categoryId }),
      top: (route) => ({ title: i18n.t('components.shop.thanksMessage.topbar')})
    }
  }
]

export default shopRoutes
