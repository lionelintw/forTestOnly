<?php
function unicode($str = "", $charset = "unicode", $op = "encode")//UTF8字串與Unicode/UTF8碼之間的轉換/還原
{
    if ($charset == "unicode")
    {
        if ($op == "encode")
        {
            $i = 0;
            $unicode_html = "";
            $Strlen = mb_strlen($str, 'utf8');
            for ($i = 0; $i < $Strlen; $i++)
            {
                /* 將 '我' 轉換成 '25105' 或 '&#25105;' */
                // 使用 iconv
                $str1 = base_convert(bin2hex(iconv('UTF-8', 'UCS-4', mb_substr($str, $i, 1, 'utf8'))), 16, 10); // 25105
                // 使用 mb_convert_encoding
                //$str = base_convert(bin2hex(mb_convert_encoding(mb_substr($str, $i, 1, 'utf8'), 'ucs-4', 'utf-8')), 16, 10); // 25105
                // 補齊格式為 &#xxxxx;
                $unicode_html .= '&#' . $str1 . ';'; // &#25105;
            }
        }
        if ($op == "decode")
        {
            $i = 0;
            $unicode_html = "";
            $Strlen = mb_strlen($str, 'utf8');
            for ($i = 0; $i < $Strlen; $i++)
            {
                // 將 &#25105 轉回 '我'
                $unicode_html .= mb_convert_encoding(mb_substr($str, $i, 1, 'utf8'), 'UTF-8', 'HTML-ENTITIES'); // '我', $unicode_html = '&#25105'
            }
        }

        return $unicode_html;
    }
    if ($charset == "utf8")
    {
        if ($op == "encode")
        {
            $twStr = $str; //字串
            $Strlen = strlen($twStr) * 2;
            //utf-8 code
            $code = unpack("H{$Strlen}utf8", $twStr); //echo $code['utf8'];
            $utf8_html = $code['utf8'];
        }
        if ($op == "decode")
        {
            $Strlen = strlen($str) * 2;
            //字串
            $twStr = @pack("H{$Strlen}", $str); //echo $twStr;
            $utf8_html = $twStr;
        }
        return $utf8_html;
    }
}
echo "<br/>" . unicode("我", "unicode", "encode");
echo "<br/>" . unicode("&#25105;", "unicode", "decode");
echo "<br/>" . unicode("我", "utf8", "encode");
echo "<br/>" . unicode("e68891", "utf8", "decode");
?>

