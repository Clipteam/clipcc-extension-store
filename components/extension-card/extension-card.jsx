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
        bindAll(this, ['handleClick']);
        this.state = { disabled: true };
    }

    async componentDidMount () {
        const extensionChannel = new BroadcastChannel('extension');
        const getInstalled = new Promise(resolve => {
            extensionChannel.postMessage({ action: 'get' });
            extensionChannel.addEventListener('message', (event) => {
                if (event.data.action === 'tell') {
                    console.log(event.data.data);
                    resolve(event.data.data);
                }
            }, { once: true });
        });
        const installed = await getInstalled;
        this.setState({ disabled: installed.includes(this.props.id) });
    }

    handleClick () {
        const extensionChannel = new BroadcastChannel('extension');
        extensionChannel.postMessage({
            action: 'add',
            extension: this.props.id,
            download: this.props.download
        });
        this.setState({ disabled: true });
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
                            {this.state.disabled ? 'Installed' : 'Install'}
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
    inset_icon: 'https://raw.githubusercontent.com/SinanGentoo/oh-my-catblocks/master/assets/inset_icon.svg',
};

export default ExtensionCard;