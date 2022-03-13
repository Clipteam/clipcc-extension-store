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
        this.state = {
            status: 'loading',
            extensions: [{
                name: 'Loading...',
                author: 'Please wait'
            }]
        };
    }
    
    async componentDidMount () {
        let fetched;
        try {
            fetched = await axios.get('https://cdn.blestudio.com/gh/Clipteam/clipcc-extension-list/list.json');
            console.log(fetched.data);
            this.setState({
                status: 'loaded',
                extensions: fetched.data.data
            });
        } catch (error) {
            this.setState({
                status: 'error'
            });
            console.log(error);
        }
    }

    render() {
        return (
            <Box>
                <Head>
                    <title>ClipCC Extension Store</title>
                </Head>
                <MenuBar />
                {
                    this.state.status === 'error'? <h1>Unable to fetch extension list. <a href="">Reload</a></h1>
                    : this.state.extensions.map((extension) => <ExtensionCard key={null} {...extension}/>)
                }
            </Box>
        )
    }
}

export default Home;
