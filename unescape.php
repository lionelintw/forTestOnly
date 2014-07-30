<?PHP
//用於 decode javascript escape()
function unescape($str,$charset="UTF-8") {
      $str = rawurldecode($str);
      preg_match_all("/%u.{4}|&#x.{4};|&#\d+;|&#\d+?|.+/U",$str,$r);
      $ar = $r[0];
      foreach($ar as $k=>$v) {
          if(substr($v,0,2) == "%u")
          $ar[$k] = iconv("UCS-2",$charset,pack("H4",substr($v,-4)));
          else if(substr($v,0,3) == "&#x")
          $ar[$k] = iconv("UCS-2",$charset,pack("H4",substr($v,3,-1)));
          elseif(substr($v,0,2)=="&#")  
          $ar[$k]=iconv("UCS-2",$charset,pack("n",substr($v,2,-1)));
      }
      return join("",$ar);
  }
$str = "%u8A31%u84CB%u529F";//UTF-8
//$str = "%B3%5C%BB%5C%A5%5C";//Big5
echo unescape($str);