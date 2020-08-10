import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {DialogContent, DialogFooter, ConfirmButton} from "../FoodDialog/FoodDialog";
import {formatPrice} from "../Data/FoodData";
import {getPrice} from "../FoodDialog/FoodDialog";
import {removeItem, addItem, emptyCart, addSubtotal} from "../Cart/carthelper";

const OrderStyled = styled.div`
position: fixed;
right: 0px;
top: 57px;
width: 340px;
background-color: white;
height: calc(100% - 48px);
z-index: 10;
box-shadow: 4px 0px 5px 4px grey;
display: flex;
flex-direction: column;
`;

const OrderContent = styled(DialogContent)`
padding: 20px;
height: 100%
`;

const OrderContainer = styled.div`
    padding: 10px 0px;
    border-bottom: 1px solid grey;
    ${({editable}) =>
editable ? `
&:hover {
    cursor: pointer;
    background-color: #e7e7e7;
}
`
    : `
    pointer-events: none;
    `}
`;

const OrderItem = styled.div`
    padding: 10px 0px;
    display: grid;
    grid-template-columns: 20px 150px 20px 60px;
    justify-content: space-between;
`;

const DetailItem = styled.div`
    color: gray;
    font-size: 10px;
`

export function Order({orders, setOrders, setOpenFood}) {
    const subtotal = items.reduce((total, order) => {
        return total + getPrice(order);
    }, 0);
    const tax = subtotal * 0.07;
    const processingFee = (tax + subtotal) * 0.05;
    const total = subtotal + tax + processingFee;

    const deleteItem= (index) => {
        const newOrders = [...orders];
        newOrders.splice(index, 1);
        setOrders(newOrders);
    }

    return <OrderStyled>
    {orders.length === 0 ?<OrderContent>Your cart is empty...
        </OrderContent> : 
        <OrderContent>
            {" "}
            <OrderContainer>
            You have {orders.length} item(s) in your cart.
            </OrderContainer>
            {" "}
            {orders.map((order, index) => (
                <OrderContainer editable>
                    <OrderItem
                    onClick={() => {
                        setOpenFood({...order, index})
                    }}
                    >
                        <div>{order.quantity}</div>
                        <div>{order.name}</div>
                        <div 
                        style={{cursor: 'pointer'}} 
                        onClick={e =>{
                            e.stopPropagation();
                            deleteItem(index);removeItem(order._id)}}>🗑</div>
            <div>{formatPrice(getPrice(order))}</div>
                    </OrderItem>
                    <DetailItem>
                        {order.toppings
                        .filter(t => t.checked)
                        .map(topping => topping.name)
                        .join(", ")
                        }
                    </DetailItem>
                    {order.choice && <DetailItem>{order.choice}
                    </DetailItem>}
                </OrderContainer>
                 ))}
                <OrderContainer>
                    <OrderItem>
                    <div/>
                    <div>Sub-Total:</div>
                    <div>{formatPrice(subtotal)}</div>
                    </OrderItem>
                    <OrderItem>
                    <div/>
                    <div>Tax:</div>
                    <div>{formatPrice(tax)}</div>
                    </OrderItem>
                    <OrderItem>
                    <div/>
                    <div>Processing Fee:</div>
                    <div>{formatPrice(processingFee)}</div>
                    </OrderItem>
                </OrderContainer>
                <OrderContainer>
                    <OrderItem>
                    <div/>
                    <div>Total</div>
                    <div>{formatPrice(total)}</div>
                    </OrderItem>
                </OrderContainer>
           
        </OrderContent>}
        <DialogFooter>
            <ConfirmButton>
                <Link to="/checkout">
                Checkout </Link>
            </ConfirmButton>
        </DialogFooter>
    </OrderStyled>
}