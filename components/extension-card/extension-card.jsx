import * as React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import styles from './extension-card.module.css';

class ExtensionCard extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, ['handleClick','getInstalledDesktop']);
        this.state = {
            disabled: true, 
            status: 'loading'
        };
    }

    async componentDidMount () {
        const getInstalled = new Promise((resolve, reject) => {
            const extensionChannel = new BroadcastChannel('extension');
            extensionChannel.postMessage({ action: 'get' });
            extensionChannel.addEventListener('message', (event) => {
                console.log(event)
                if (event.data.action === 'tell') {
                    if (event.data.data.includes(this.props.id)){
                        this.setState({ disabled: true, status: 'installed' });
                    } else {
                        this.setState({ disabled: false, status: 'notinstalled' });
                    }
                } else if (event.data.action === 'addSuccess' && event.data.extensionId === this.props.id) {
                    this.setState({ disabled: true, status: 'installed' });
                } else if (event.data.action === 'addFail' && event.data.extensionId === this.props.id) {
                    alert(`extension "${this.props.name}" install failed!\n${event.data.error}`)
                    this.setState({ disabled: false, status: 'notinstalled' });
                }
            });
        });
        if (window.ClipCC) {
            return await this.getInstalledDesktop()
        }
        await getInstalled;
    }

    async getInstalledDesktop() {
        const extensionList = [];
        const extension = await window.ClipCC.getInstalledExtension();
        for (const ext in extension) extensionList.push(ext);
        if (extensionList.includes(this.props.id)){
            this.setState({ disabled: true, status: 'installed' });
        } else {
            this.setState({ disabled: false, status: 'notinstalled' });
        }
        return extension;
    }

    handleClick () {
        this.setState({ disabled: true, status: 'installing' });
        if (window.ClipCC) {
            window.ClipCC.addExtension(this.props.download)
                .then(() => this.setState({ disabled: true, status: 'installed' }))
                .catch(() => {
                    this.setState({ disabled: false, status: 'notinstalled' });
                    alert('Install Fail')
                })
        } else {
            const extensionChannel = new BroadcastChannel('extension');
            extensionChannel.postMessage({
                action: 'add',
                extension: this.props.id,
                download: this.props.download
            });
        }
    }

    getStatusText () {
        switch (this.state.status) {
            case 'loading':
                return 'Loading...'
            case 'installed':
                return 'Installed'
            case 'installing':
                return 'Installing...'
            default:
                return 'Install'
        }
    }        

    render () {
        return (
            <Box className={styles.box}>
                <Card className={styles.card}>
                    <Box className={styles.info}>
                    <Typography
                        sx={{ fontSize: 21 }}
                        color="text.primary"
                        className={styles.text}
                        align="center"
                    >
                        {this.props.name}
                    </Typography>
                    <Typography
                        sx={{ fontSize: 12 }}
                        color="text.secondary"
                        className={styles.text}
                        align="center"
                    >
                        {"Author: " + this.props.author}
                    </Typography>
                    </Box>
                    <Box className={styles.switch}>
                        <Button
                            variant="outlined"
                            onClick={this.handleClick}
                            disabled={this.state.disabled}
                        >
                            {this.getStatusText()}
                        </Button>
                    </Box>
                </Card>
            </Box>
        );
    }
}

ExtensionCard.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    inset_icon: PropTypes.string
};

ExtensionCard.defaultProps = {
    id: 'example',
    name: 'Example Extension',
    author: 'Anonymous',
    inset_icon: 'https://raw.fastgit.org/SinanGentoo/oh-my-catblocks/master/assets/inset_icon.svg',
};

export default ExtensionCard;