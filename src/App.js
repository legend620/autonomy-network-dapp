import { ChakraProvider } from '@chakra-ui/react'

import Layout from './components/Layout'
import Home from './components/Home'

export default function App() {
  return (
    <ChakraProvider>
      <Layout>
        <Home />
      </Layout>
    </ChakraProvider>
  )
}
