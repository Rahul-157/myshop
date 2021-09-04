module.exports = {
    home : async function(req,res){
        let products = await Product.find({
            quantity: { '>=' :'0' }
        });
        let num_pages = parseInt((products.length)/50)+1;
        let pg_no = typeof req.params.page!='undefined'?req.params.page:0
        products = products.slice(50*pg_no,50*pg_no+50)
        res.view('partials/home',{
            layout:"template",
            products:products,
            pages:num_pages,
            current_pg:pg_no
        })
    },
    all_products: async function(req,res){
        let products = await Product.find();
        let num_pages = parseInt((products.length)/50)+1;
        let pg_no = typeof req.params.page!='undefined'?req.params.page:0
        products = products.slice(50*pg_no,50*pg_no+50)
        res.view('partials/home',{
            layout:"template",
            products:products,
            pages:num_pages,
            current_pg:pg_no
        })
    },
    show_category_wise : async function(req,res){
        let cat_name = req.params.cat_name;
        cat_name = cat_name.split('-').join(" ").toUpperCase()
        cat_name = await Category.findOne({name:cat_name})
        let products = await Product.find({category:cat_name.id});
        let num_pages = parseInt((products.length)/50)+1;
        let pg_no = typeof req.params.page!='undefined'?req.params.page:0
        products = products.slice(50*pg_no,50*pg_no+50)
       
        res.view('partials/home',{
            layout:"template",
            products:products,
            pages:num_pages,
            cat_name:cat_name.name,
            current_pg:pg_no
        })
    },

    search_query:async function(req,res){
        if(req.body.search_query!=""){
            let results = sails.config.globals.srch_idx.search(req.body.search_query+'~1')
            var products = []
           for(let i =0 ; i<results.length;i++){
                let product = await Product.find({name:results[i].ref});
                products.push(product[0])
            };
            res.view('partials/home',{
                layout:"template",
                products:products,
                pages:1,
                cat_name:"Search results for " + "\""+ req.body.search_query+"\"",
                current_pg:0
            })
        }   
    },

    product_details: async function name(req,res) {
        let product = await Product.findOne({id:req.params.id})
        res.view('partials/product_details',{layout:'template',product:product})
    }

}