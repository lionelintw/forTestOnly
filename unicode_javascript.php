<?php
$kw = '我蓋#@*&abc,:[]{}要錢';
function unicode_encodeo($str)
{
    $i = 0;
    $unicode_html = "";
    $Strlen = strlen($str);
    for ($i = 0; $i < $Strlen; $i++)
    {
        // 使用 iconv
        //$str1 = base_convert(bin2hex(iconv('UTF-8', 'UCS-4', mb_substr($str, $i, 1, 'utf8'))), 16, 16);
        // 使用 mb_convert_encoding
        if(strlen(mb_substr($str, $i, 1, 'utf8'))>1)
        {
            $str1 = base_convert(bin2hex(mb_convert_encoding(mb_substr($str, $i, 1, 'utf8'), 'UCS-4', 'UTF-8')), 16, 16); // xxxx
            // 補齊格式為 \uxxxx;
            $unicode_html .= '\u' . $str1 . ''; // \\uxxxx
        }
        else
        {
            $str1 = mb_substr($str, $i, 1, 'utf8');
            $unicode_html .= $str1;
        }
    }
    return $unicode_html;
}

function unicode_decodeo($unicode_html)//better
{
//echo mb_convert_encoding(pack("H*" , "00006211"),'UTF-8','UCS-4');
//echo mb_convert_encoding(pack("H*" , "0061"),'UTF-8','UCS-2');
//$unicode_html = "\u6211\u61\u8981\u9322";
    //$unicode_html1 = preg_replace("/\\\u([0-9a-f]{4})/ie","iconv('UCS-2BE', 'UTF-8', pack('H4', '$1'))", $unicode_html);
    $unicode_html1 = preg_replace_callback("/\\\u([0-9a-f]{4})/i",function ($m) {return iconv('UCS-2BE', 'UTF-8', pack('H4', $m[1]));}, $unicode_html);//PHP5.5+
    //$unicode_html1 = preg_replace("/\\\u([\w]{4})/ie","iconv('UCS-2BE', 'UTF-8', pack('H4', '$1'))", $unicode_html);
    return $unicode_html1;
}
echo unicode_decodeo(unicode_encodeo($kw));

function unicode_encodea($name)//better
{
    $name = iconv('UTF-8', 'UCS-2BE', $name);
    $len = strlen($name);
    $str = '';
    for ($i = 0; $i < $len - 1; $i = $i + 2)
    {
        $c = $name[$i];
        $c2 = $name[$i + 1];
        if (ord($c) > 0)
        {
            // 兩個字節的文字
            $str .= '\u'.base_convert(ord($c), 10, 16).base_convert(ord($c2), 10, 16);
        }
        else
        {
            $str .= $c2;
        }
    }
    return $str;
}
$name = '我蓋#@*&abc,:[]{}要錢';
$unicode_name=unicode_encodea($name);
echo '<br>'.$unicode_name.'<br>';
// 將UNICODE編碼後的內容進行解碼
function unicode_decodea($name)
{
    // 轉換編碼，將Unicode編碼轉換成可以瀏覽的utf-8編碼
	//$pattern = '/([\w])+|(\\\u([\w]{4}))/i';//輸出不含符號
    $pattern = '/(\\\u([\w]{4}))|([\s\S])/i';
    preg_match_all($pattern, $name, $matches);
    if (!empty($matches))
    {
        $name = '';
        for ($j = 0; $j < count($matches[0]); $j++)
        {
            $str = $matches[0][$j];
            if (strpos($str, '\\u') === 0)
            {
                $code = base_convert(substr($str, 2, 2), 16, 10);
                $code2 = base_convert(substr($str, 4), 16, 10);
                $c = chr($code).chr($code2);
                $c = iconv('UCS-2BE', 'UTF-8', $c);
                $name .= $c;
            }
			elseif(strpos($str, '\\') === 0)
			{
				$name .= '';
			}			
            else
            {
                $name .= $str;
            }
        }
    }

    return $name;
}
echo unicode_decodea($unicode_name);
?>
<script>
//document.write("<?=unicode_encodeo($kw)?>");
//document.write("<?=unicode_encodea($name)?>");
</script>
