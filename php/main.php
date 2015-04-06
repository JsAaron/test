<?php

abstract class Show{
    protected $products = array();
    public function addP(showP $showP){
        $this->products[] = $showP;
    }
    abstract public function write();
}








class StaticExample{

    static public $a = 0;

    static function sayHellow(){
        self::$a++;
        print self::$a;
    }

}

