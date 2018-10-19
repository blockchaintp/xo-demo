import React from 'react'

import { connectStore } from 'redux-box'
import { connect } from 'react-redux'

/*

  pages
  
*/
import GameList from './pages/GameList'
import Keys from './pages/Keys'

/*

  layouts
  
*/
import MainLayout from './layouts/Main'

/*

  utils
  
*/
import Loading from './components/Loading'
import withRouter from './utils/withRouter'

export const routes = {
  'PAGE_HOME': {
    path: '/',
    component: GameList,
  },
  'PAGE_KEYS': {
    path: '/keys',
    component: Keys,
  },
}

const NotFound = () => (
  <div>not found</div>
)

@withRouter()
class AppRouter extends React.Component {

  componentDidMount(){
    
  }

  render() {

    const { router } = this.props
    const pageName = router.type
    const routeInfo = routes[pageName]
    const Page = routeInfo ? routeInfo.component : NotFound

    const MainLayoutComponent = routeInfo && routeInfo.mainLayout ? routeInfo.mainLayout : MainLayout
    const PageLayout = routeInfo && routeInfo.pageLayout ? routeInfo.pageLayout : null

    return (
      <MainLayoutComponent>
        {
          PageLayout ? (
            <PageLayout>
              <Page />
            </PageLayout>
          ) : (
            <Page />
          )
        }
      </MainLayoutComponent>
    )
  }
}

export default AppRouter