/**
 * Created by Administrator on 2015/4/1.
 */

$.ajax({
    url      : 'test.php',
    //dataType : 'json',
    data: {
        xxtsql: 'select * form seeting'
    },
    success:function(rs){
        console.log(arguments)
    },
    error:function(){
        console.log(arguments)
    }
});





