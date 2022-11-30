//json-server --watch db.json --port 4000

let customer = {
    table: '',
    hour: '',
    order: []
};

const categorys = {
    1: 'Lunch',
    2: 'Drinks',
    3: 'Dess'
}

const btSave = document.querySelector('#save-custo');
btSave.addEventListener('click', saveCusto);

function saveCusto(){
    const table = document.querySelector('#table').value;
    const hour = document.querySelector('#hour').value;
    const msnError = [table, hour].some( msn => msn === '');

    if(msnError){

        const noRepeat = document.querySelector('.invalid-feedback');

        if(!noRepeat){
            const err = document.createElement('div');
                err.classList.add('invalid-feedback', 'd-block', 'text-center')
                err.textContent = 'All fields needs fill';
                document.querySelector('.modal-body form').appendChild(err);
                setTimeout(() => {
                    err.remove();
                }, 2200);

        }

        return;
        
    }
    
    customer = {...customer, table, hour}

    const modalForm = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
    modalBootstrap.hide();

    shwSecc();
    getMenu();

}

function shwSecc(){
    const hiddSecc = document.querySelectorAll('.d-none');
    hiddSecc.forEach(hidd => hidd.classList.remove('d-none'));
}

function getMenu(){
    const url = 'http://localhost:4000/platillos';
    fetch(url)
        .then(asw => asw.json())
        .then( rlt => shwMenu(rlt))
        .catch(error => console.log(error));       
}

function shwMenu(rlt){
    
    const cont = document.querySelector('#men .contenido'); 

    rlt.forEach( rl => {
        
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');
        
     
        const name = document.createElement('div');
        name.classList.add('col-md-4');
        name.textContent = rl.name;

        const price = document.createElement('div');
        price.classList.add('col-md-3', 'fw-bold');
        price.textContent = `$: ${rl.price}`;

        const category = document.createElement('div');
        category.classList.add('col-md-3', 'fw-bold');
        category.textContent = categorys [rl.category];

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 0;
        input.value = 0;
        input.id = `product-${rl.id}`;
        input.classList.add('form-control');

        input.onchange = function (){
            const qty = parseInt(input.value);
            
            adOrder({...rl, qty});
        }

        const agg = document.createElement('div');
        agg.classList.add('col-md-2');
        agg.appendChild(input);
        



        
        
        row.appendChild(name);
        row.appendChild(price);
        row.appendChild(category);
        row.appendChild(agg);
        cont.appendChild(row);

    }) 
}

function adOrder(product){
    let {order} = customer;
    if(product.qty > 0 ){

        if(order.some( art => art.id === product.id)){

            const orderAtz = order.map(art =>{
                if(art.id === product.id){
                    art.qty = product.qty;
                }
                return art;
            });
            customer.order = [...orderAtz];

        }else{
            customer.order = [...order, product];
        }

        
    }else{
        const rlt = order.filter( art => art.id !== product.id );
        customer.order = [...rlt];
    }

    clnHTML();

    if( customer.order.length){
        atzOrder1();
    }else{
        restart();
    }

    
   
}

function atzOrder1(){
    const cont  = document.querySelector('#ord .contenido');

    const ord = document.createElement('div');
    ord.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    const table = document.createElement('p');
    table.textContent = 'table: ';
    table.classList.add('fw-bold');

    const tableSpan = document.createElement('span');
    tableSpan.textContent = customer.table;
    tableSpan.classList.add('fw-normal');
    
    const hour = document.createElement('p')
    hour.textContent = 'hour: ';
    hour.classList.add('fw-bold');

    const hourSpan = document.createElement('span');
    hourSpan.textContent = customer.hour;
    hourSpan.classList.add('fw-normal');

    table.appendChild(tableSpan);
    hour.appendChild(hourSpan);

    const heading = document.createElement('h3')
    heading.textContent = 'Consumed';
    heading.classList.add('my-4', 'text-center');

    const group = document.createElement('ul');
    group.classList.add('list-group');

    const {order} = customer;
    order.forEach(art => {
        const {name, qty, price, id } = art;

        const list = document.createElement('li');
        list.classList.add('list-group-item');

        const nameLi = document.createElement('h4');
        nameLi.classList.add('my-4');
        nameLi.textContent = name;

        const qtyLi = document.createElement('p')
        qtyLi.classList.add('fw-bold')
        qtyLi.textContent = `Untis: ${qty}`;

        const priceLi = document.createElement('p')
        priceLi.classList.add('fw-bold')
        priceLi.textContent = `Price: $${price}`;

        const subtotalLi = document.createElement('p')
        subtotalLi.classList.add('fw-bold')
        subtotalLi.textContent = `Subtotal: $${price * qty}`;

        const btnErr = document.createElement('button')
        btnErr.classList.add('btn', 'btn-danger', 'fw-bold')
        btnErr.textContent = 'x';
        btnErr.onclick = function() {
            erraseOrd(id);
        }

        list.appendChild(nameLi);
        list.appendChild(qtyLi);
        list.appendChild(priceLi);
        list.appendChild(subtotalLi);
        list.appendChild(btnErr);

        group.appendChild(list);
    })

    ord.appendChild(heading);
    ord.appendChild(table);
    ord.appendChild(hour);
    ord.appendChild(group);
    cont.appendChild(ord);

    formTips();
}

function clnHTML(){
    const ctn = document.querySelector('#ord .contenido');

    while( ctn.firstChild ){
        ctn.removeChild(ctn.firstChild);
    }

}

function erraseOrd (id){
    const {order} = customer;
    const rlt = order.filter( art => art.id !== id );
        customer.order = [...rlt];

    clnHTML();

    if(customer.order.length){
        atzOrder1();
    }else{
        restart();
    }

    const orderErr = `#product-${id}`;
    const inputErr = document.querySelector(orderErr)
    inputErr.value = 0;

    
}

function restart() {
    const cont = document.querySelector('#ord .contenido');
    const txt = document.createElement('p');
    txt.classList.add('text-center');
    txt.textContent = 'Add order'; 

    cont.appendChild(txt);
}

function formTips(){
    const cont = document.querySelector('#ord .contenido');
    const form = document.createElement('div');
    form.classList.add('col-md-6', 'formulario');

    const divForm = document.createElement('div');
    divForm.classList.add('card', 'py-5', 'px-3', 'shadow', 'bg-warning')

    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center')
    heading.textContent = 'Tips';

    const tip0 = document.createElement('input');
            tip0.type = 'radio';
            tip0.name = 'tips';
            tip0.value = '0,1';
            tip0.classList.add('form-check-input');
            tip0.onclick = tipsCalc;

    const tip0Lab = document.createElement('label');
            tip0Lab.textContent = '0';
            tip0Lab.classList.add('form-check-label');

    const tip0Div = document.createElement('div');
            tip0Div.classList.add('form-check');



    

    const tip1 = document.createElement('input');
    tip1.type = 'radio';
    tip1.name = 'tips';
    tip1.value = '10';
    tip1.classList.add('form-check-input');
    tip1.onclick = tipsCalc;

    const tip1Lab = document.createElement('label');
    tip1Lab.textContent = '10%';
    tip1Lab.classList.add('form-check-label');

    const tip1Div = document.createElement('div');
    tip1Div.classList.add('form-check');

    
    const tip2 = document.createElement('input');
    tip2.type = 'radio';
    tip2.name = 'tips';
    tip2.value = '20';
    tip2.classList.add('form-check-input');
    tip2.onclick = tipsCalc;

    const tip2Lab = document.createElement('label');
    tip2Lab.textContent = '20%';
    tip2Lab.classList.add('form-check-label');

    const tip2Div = document.createElement('div');
    tip2Div.classList.add('form-check');

    const tip3 = document.createElement('input');
    tip3.type = 'radio';
    tip3.name = 'tips';
    tip3.value = '30';
    tip3.classList.add('form-check-input');
    tip3.onclick = tipsCalc;

    const tip3Lab = document.createElement('label');
    tip3Lab.textContent = '30%';
    tip3Lab.classList.add('form-check-label');

    const tip3Div = document.createElement('div');
    tip3Div.classList.add('form-check');

    tip0Div.appendChild(tip0);
    tip0Div.appendChild(tip0Lab);

    tip1Div.appendChild(tip1);
    tip1Div.appendChild(tip1Lab);

    tip2Div.appendChild(tip2);
    tip2Div.appendChild(tip2Lab);

    tip3Div.appendChild(tip3);
    tip3Div.appendChild(tip3Lab)

    divForm.appendChild(heading);
    divForm.appendChild(tip0Div);
    divForm.appendChild(tip1Div);
    divForm.appendChild(tip2Div);
    divForm.appendChild(tip3Div);

    form.appendChild(divForm);

    

    cont.appendChild(form);
}

function tipsCalc(){
    const { order} = customer;
    let subtotal = 0;

    order.forEach(art => {
        subtotal += art.qty * art.price;
    })

    const selectTip = document.querySelector('[name="tips"]:checked').value;

    const tips = ((subtotal * parseInt(selectTip)) /100);
    const total = subtotal + tips;

    shwTotal(subtotal, total, tips);
}

function shwTotal( subtotal, total, tips){

    const totals = document.createElement('div');
    totals.classList.add('total-pagar','mt-2', 'text-center');


    const totalP = document.createElement('p');
    totalP.classList.add('fs-3', 'fw-bold', 'mt-2', 'text-center');
    totalP.textContent = 'Subtotal:'; 

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    const totalP2 = document.createElement('p');
    totalP2.classList.add('fs-3', 'fw-bold', 'mt-2');
    totalP2.textContent = 'Tips:'; 

    const subTotal2 = document.createElement('span');
    subTotal2.classList.add('fw-normal');
    subTotal2.textContent = `  $  ${tips}`;

    const totalP3 = document.createElement('p');
    totalP3.classList.add('fs-3', 'fw-bold', 'mt-2');
    totalP3.textContent = 'Total:'; 

    const tot = document.createElement('span');
    tot.classList.add('fw-normal', 'text-decoration-underline');
    tot.textContent = `$${total}`;

    totalP2.appendChild(subTotal2);
    totalP.appendChild(subtotalSpan);
    totalP3.appendChild(tot);

    const totalDiv = document.querySelector('.total-pagar');
    if(totalDiv){
        totalDiv.remove();
    }

    totals.appendChild(totalP);
    totals.appendChild(totalP2);
    totals.appendChild(totalP3);

    const form = document.querySelector('.formulario > div');
    form.appendChild(totals);
}


