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
        console.log(this.props.extensions);
        return (
            <Box>
                <Head>
                    <title>ClipCC Extension Store</title>
                </Head>
                <MenuBar />
                {this.props.extensions.map((extension) => <ExtensionCard key={null} {...extension}/>)}
            </Box>
        )
    }
}

export async function getServerSideProps (ctx) {
    let fetched = null;
    try {
        fetched = await axios.get('https://raw.githubusercontent.com/Clipteam/clipcc-extension-list/master/list.json');
    } catch (error) {}
    return {
        props: {
            extensions: fetched.data.data
        }
    }
}

export default Home;