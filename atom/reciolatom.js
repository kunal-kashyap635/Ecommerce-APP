import { atom } from 'recoil';

export const cartdata = atom({
    key: 'cartdata',
    default: [],
});

export const totalamount = atom({
    key: 'totalamount',
    default: 0,
});

export const totalitems = atom({
    key: 'totalitems',
    default: 0,
});

export const cartcount = atom({
    key: 'cartcount',
    default: 0, // Start with 0 items in the cart
});

export const wishlist = atom({
    key: 'wishlist',
    default: [], // Start with an empty array for the wishlist
});
