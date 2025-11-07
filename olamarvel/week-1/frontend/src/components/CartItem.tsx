export default function CartItem({image,name,price,quantity}: {image: string, name: string, price: number, quantity: number}){
    return <div>
        <img src={image} alt="product image"/>
        <div>{name}</div>
        <div>{price}</div>
        <div>{quantity}</div>
    </div>
}