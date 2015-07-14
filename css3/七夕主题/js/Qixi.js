/**
 * 七夕主题效果
 * https://github.com/rstacruz/jquery.transit/blob/master/jquery.transit.js
 * http://code.ciaoca.com/jquery/transit/demo/
 * @type {Object}
 */
var Qixi = function() {

    //走过的位置
    var instanceX;

    //页面容器
    var container = $("#content");
    //页面可视区域
    var visualWidth = container.width()
    var visualHeight = container.height()

    //时间设置(时间毫秒）
    var walkTime = 3000; //正常走路
    var inShopWalkTime = 1500; //进商店时间
    var outShopWalkTime = 1500; //出商店时间
    var simulateWaitTime = 1000; //模拟等待时间
    var openDoorTime = 1000; //开门时间
    var shutDoorTime = 1000 //关门时间

    ///////////
    //场景页面滑动对象 //
    ///////////
    var swipe = Swipe(container);
    //页面滚动到指定的位置
    function scrollTo(dist) {
        swipe.scrollTo(dist, walkTime)
    }


    ////////
    //小女孩 //
    ////////
    var girl = {
        elem: $('.girl'),
        //转身动作
        rotate: function() {
            this.elem.addClass('girl-rotate')
        },
        setOffset: function() {
            this.elem.css({
                left: visualWidth / 2
            })
        }
    }

    //////////
    // 小孩走路 //
    //////////
    var boy = BoyWalk();
    // return
    //开始走路
    boy.walkTo(1.8)
        .then(function() {
            //开始滚动页面
            scrollTo(visualWidth)
        }).then(function() {
            //第二次走路
            return boy.walkTo(2)
        }).then(function() {
            //右边飞鸟
            var brid = Bird();
            brid.fly();
        }).then(function() {
            //去商店
            return toShop(boy);
        }).then(function() {
            //自适应分辨率
            //修正小女孩的坐标,位于中间
            girl.setOffset();
            //页面继续滚动
            scrollTo(2 * visualWidth);
            //人物要往回走1/7处
            return boy.walkTo(10)
        }).then(function() {
            //上桥
            return boy.walkTo(4, 2.7)
        }).then(function() {
            //算出应该走的距离比
            var proportionX = visualWidth / (visualWidth / 2 - instanceX - $("#boy").width() + 20);
            //桥上走路
            return boy.walkTo(proportionX)
        }).then(function() {
            //停止走路  
            boy.stopWalk();

            setTimeout(function() {
                //增加转身动作 
                girl.rotate();
                boy.rotate(function() {
                    //如果转身完毕
                    //开始飘花
                    snowflake()
                });
            }, 1000)

        });


    //监听页面移动变化
    swipe.watch('move', function(distance) {})
        //监听页面移动完成
    swipe.watch('complete', function() {})


    /**
     * 小孩走路
     * @param {[type]} container [description]
     */
    function BoyWalk() {

        //走路对象
        var $boy = $("#boy");
        var boyWidth = $boy.width();
        //中间位置
        var middleDist = visualWidth / 2 + boyWidth;


        //暂停走路
        function pauseWalk() {
            $boy.addClass('pauseWalk')
        }

        //恢复走路
        function restoreWalk() {
            $boy.removeClass('pauseWalk')
        }

        //css3的动作变化
        function slowWalk() {
            $boy.addClass('slowWalk')
        }

        //用transition做运动
        function stratRun(options, runTime) {
            var dfdPlay = $.Deferred();
            //恢复走路
            restoreWalk();
            //运动的属性
            $boy.transition(
                options,
                runTime,
                'linear',
                function() {
                    dfdPlay.resolve(); //动画完成
                });
            return dfdPlay;
        }

        //开始走路
        function walkRun(dist, disY) {
            //脚动作
            slowWalk();
            //开始走路
            var d1 = stratRun({
                'left': dist + 'px',
                'top': disY ? disY : undefined
            }, walkTime);
            return d1;
        }

        //走进商店
        function walkToShop(offsetDoor, doorMiddle, runTime) {
            var inShop = $.Deferred();
            //小孩当前的坐标
            var offsetBoy = $boy.offset();
            //当前的坐标
            instanceX = offsetDoor.left - offsetBoy.left + doorMiddle;
            var instanceZ = offsetBoy.top - offsetDoor.top

            //开始走路
            var walkPlay = stratRun({
                transform: 'rotateX(20deg) translateZ(' + instanceZ + 'px) translateX(' + instanceX + 'px) scale3d(.3, .3, .3)',
                opacity: 0.3
            }, runTime);
            //走路完毕
            walkPlay.done(function() {
                $boy.css({
                    opacity: 0
                })
                inShop.resolve();
            })
            return inShop;
        }

        //走出店
        function walkOutShop(runTime) {
            var outShop = $.Deferred();
            restoreWalk();
            //开始走路
            var walkPlay = stratRun({
                    transform: 'rotateX(0deg) translateZ(0px) translateX(' + instanceX + 'px)',
                    opacity: 1
                }, runTime)
                //走路完毕
            walkPlay.done(function() {
                outShop.resolve();
            })
            return outShop;
        }

        //计算移动距离
        function calculateDist(direction, proportion) {
            return (direction == "x" ?
                visualWidth : visualHeight) / proportion;
        }

        return {
            //开始走路
            walkTo: function(proportionX, proportionY) {
                var distX = calculateDist('x', proportionX)
                var distY = calculateDist('y', proportionY)
                return walkRun(distX, distY);
            },
            //停止走路
            stopWalk: function() {
                pauseWalk();
            },
            //恢复走路
            restoreWalk: function() {
                restoreWalk();
            },
            //走进商店
            goShop: function() {
                return walkToShop.apply(null, arguments);
            },
            //走出商店
            outShop: function() {
                return walkOutShop.apply(null, arguments);
            },
            //转身动作
            rotate: function(callback) {
                $boy.addClass('boy-rotate')
                this.restoreWalk();
                //监听转身完毕
                if (callback) {
                    $boy[0].addEventListener("webkitAnimationEnd", function() { //动画结束时事件 
                        callback()
                    }, false);
                }
            },
            //获取人物走过的距离
            getDistance: function() {
                return $boy.offset().left
            }
        }
    }

    /**
     * 商店
     * @return {[type]} [description]
     */
    var toShop = function(walk) {

        var shopDefer = $.Deferred();
        var doorLeft = $('.door-left');
        var doorRight = $('.door-right')

        function doorAction(left, right, time) {
            var defer = $.Deferred();
            var count = 2;
            //等待开门完成
            var complete = function() {
                if (count == 1) {
                    defer.resolve();
                    return;
                }
                count--
            }
            doorLeft.transition({
                'left': left
            }, time, complete)
            doorRight.transition({
                'left': right
            }, time, complete)
            return defer
        }

        //开门
        function openDoor(time) {
            return doorAction('-50%', '100%', time)
        }

        //关门
        function shutDoor(time) {
            return doorAction('0%', '50%', time)
        }

        //取花
        function talkFlower() {
            $("#boy").addClass('slowFlolerWalk')
        }

        var $door = $('.door');

        //门中间位置
        var doorMiddle = $door.width() / 4;

        //开门动作
        var waitOpen = openDoor(openDoorTime)

        //等待开门
        //开始执行一系列动作
        waitOpen
            .then(function() {
                //进入商店
                return walk.goShop($door.offset(), doorMiddle, inShopWalkTime)
            })
            .then(function() {
                //取花
                talkFlower();
            })
            .then(function() {
                //增加延时等待效果
                var defer = $.Deferred();
                setTimeout(function() {
                    defer.resolve()
                }, simulateWaitTime)
                return defer
            })
            .then(function() {
                //走出商店
                return walk.outShop(outShopWalkTime)
            })
            .then(function() {
                //商店关门
                return shutDoor(shutDoorTime);
            })
            .then(function() {
                //新的动作
                shopDefer.resolve();
            })

        return shopDefer;
    }

    /**
     * 左边飞鸟
     */
    var Bird = function() {
        var $brid = $(".bird");

        function run() {
            $brid.addClass('birdFly')
            $brid.transition({
                right: visualWidth
            }, 10000, 'linear');
        }
        return {
            fly: function() {
                run();
            },
            stop: function() {

            }
        }
    }


    ///////
    //飘雪花 //
    ///////
    function snowflake() {
        //雪花容器
        var $flakeContainer = $('#snowflake');
        //随机六张图
        function getImagesName() {
            return 'snowflake' + [Math.floor(Math.random() * 6) + 1]
        };
        //创建一个雪花元素
        function createSnowBox() {
                var url = 'images/snowflake/' + getImagesName() + '.png';
                return $('<div class="snowbox" />').css({
                    'width': 41,
                    'height': 41,
                    'position': 'absolute',
                    'backgroundSize': 'cover',
                    'zIndex': 100,
                    'top': '-41px',
                    'backgroundImage': 'url(' + url + ')'
                }).addClass('snowRoll')
            }
            //开始飘花
        setInterval(function() {
            //运动的轨迹
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity = 1
            endPositionTop = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration = visualHeight * 10 + Math.random() * 5000;

            //随机透明度，不小于0.5
            var randomStart = Math.random()
            randomStart = randomStart < 0.5 ? startOpacity : randomStart

            //创建一个雪花
            var $flake = createSnowBox();
            //设计起点位置
            $flake.css({
                    left: startPositionLeft,
                    opacity: randomStart
                })
                //加入到容器
            $flakeContainer.append($flake)
                //开始执行动画
            $flake.transition({
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0.7
            }, duration, 'ease-out', function() {
                $(this).remove() //结束后删除
            })
        }, 200);
    }

};



$(function() {

    //七夕主题效果，开始
    Qixi()
})
