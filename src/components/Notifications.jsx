import React, { Component } from 'react';
import { Button, OverlayTrigger, ButtonToolbar, Popover  } from 'react-bootstrap';
import BellIcon from 'react-bell-icon';
import Alert from 'react-bootstrap/es/Alert'


export default class Notifications extends Component{
    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
            newNotification: false,
            unRead: []
        };
    }

    receiveNotification = () => {
        this.setState({newNotification : true})
        setTimeout(() => this.setState({newNotification : false}), 2000)
        this.state.unRead.push({
            title : 'Nova nota recebida',
            date: new Date().toLocaleTimeString()
        })
    } 

    readAll = () => {
        this.setState({unRead : []})
    }

    deleteNotification = index => {
        let clone = this.state.unRead.slice(0)
        clone[index] = null
        this.setState({unRead : clone})
    }

    notificationList = () => {

        let alertArray = this.state.unRead.map(

            (notification, index) => {
                if(notification)
                    return (
                        <Button key={index} onClick={()=> this.deleteNotification(index)}>
                            <Alert  variant='light'>
                                {notification.title}
                                <br/>
                                {notification.date}
                            </Alert>
                        </Button>
                    )
            }
        ); 

        return alertArray
    }

    render() {
        
        return (
            <>
                <Button onClick={() => this.receiveNotification()}> Receber notificação</Button>
                <div className='notifications'>
                    <ButtonToolbar>
                        <OverlayTrigger trigger="click" key="bottom" placement="bottom"  overlay={
                            <Popover id='popover-positioned-bottom' title='Notifications' >
                               {this.notificationList()}
                            </Popover>
                        }>
                            <BellIcon width='30' color="#FFAE00" active={this.state.unRead.length>0} animate={this.state.newNotification}/>
                        </OverlayTrigger>
                    </ButtonToolbar>
                    <div className='notifications-count'><span><strong>{this.state.unRead.filter(notification => notification !== null).length}</strong></span></div>
                </div>
            </>

        )
    }

    
}