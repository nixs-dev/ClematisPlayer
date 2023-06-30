import React from "react";
import "../styles/LoadingPopup.scss";

export default class LoadingPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: null,
            finished: true,
            loaded: 0,
        }
    }

    async newLoading(title, request) {
        if(!this.state.finished) {
            return false;
        }

        await new Promise((resolve, reject) => {
            this.setState({ title: title, loaded: 0, finished: false }, () => {
                resolve();
            });
        });

        // Start request

        request = request((loaded) => this.onLoad(loaded));

        return new Promise((resolve, reject) => {
            request.then((response) => {
                setTimeout(() => {
                    this.setState({ finished: true }, () => {
                        this.props.close();
                        
                        resolve(response);
                    });
                }, 2000);
            })
        });
    }

    onLoad(loaded) {
        this.setState({ loaded : loaded });
    }

    render() {
        if(this.props.open) {
            return (
                <div className="modal-overlay">
                    <div className="modal" id="loading-modal">
                        <div className="modal-header">
                            { this.state.title ? this.state.title : null }
                        </div>
                        <div className="modal-content">
                            <div id="loading-bar">
                                <div id="progress-bar" style={{ width: this.state.loaded + "%" }}>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return null
        }
    }
}