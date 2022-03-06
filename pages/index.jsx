import * as React from 'react';
import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios';
import ExtensionCard from '../components/extension-card/extension-card.jsx';
import MenuBar from '../components/menu-bar/menu-bar.jsx';
import Box from '@mui/material/Box';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Box>
                <Head>
                    <title>ClipCC Extension Store</title>
                </Head>
                <MenuBar />
                {
                    this.props.extensions === null? <h1>Unable to fetch extension list. <a href="">Reload</a></h1>
                    : this.props.extensions.map((extension) => <ExtensionCard key={null} {...extension}/>)
                }
            </Box>
        )
    }
}

export async function getServerSideProps (ctx) {
    let fetched = null;
    try {
        fetched = await axios.get('https://cdn.blestudio.com/gh/Clipteam/clipcc-extension-list/list.json');
        console.log(fetched.data);
    } catch (error) {
        console.log(error);
    }
    return {
        props: {
            extensions: fetched === null ? fetched.data.data : null
        }
    }
}

export default Home;
