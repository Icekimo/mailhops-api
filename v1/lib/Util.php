<?php
/** Utility Class
 *
 * @package	mailhops
 * @author  Andrew Van Tassel <andrew@andrewvantassel.com>
 * @version	1.0
 */
class Util {
	
	public static function toString($var){
		return ($var && trim($var))?strval($var):'';
	}

	public static function toInteger($var){
		return ($var && trim($var))?intval($var):0;
	}

	public static function toFloat($var){
		return ($var && trim($var))?floatval($var):0.0;
	}

	public static function toBoolean($var){
		switch(Util::toString($var)){
			case 'true':
			case 't':
			case '1':	
					return true;
			case '':
			case 'false':
			case 'f':
			case '0':
					return false;
			default:
				return !!intval($var);
		}
	}
	
	public static function toCelsius($var){
		return round((5/9) * ($var-32));
	}
	
	public static function strCompare($str1,$str2)
	{
		if(strtolower(trim($str1))==strtolower(trim($str2)))
			return true;
		else
			return false;
	}
	
	//Thanks to http://roshanbh.com.np/2007/12/getting-real-ip-address-in-php.html
	public static function getRealIpAddr()
	{
	    if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
	    {
	      $ip=$_SERVER['HTTP_CLIENT_IP'];
	    }
	    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
	    {
	      $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
	    }
	    else
	    {
	      $ip=$_SERVER['REMOTE_ADDR'];
	    }
	    return $ip;
	}
	
	public static function getVersion($version){
	
		$version = end(explode(' ',$version));
		return str_replace('.','',$version);		
	
	}
}