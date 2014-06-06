<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <link href="/resources/css/bootstrap.min.css" rel="stylesheet">
    <link href="/resources/css/style.css" rel="stylesheet">
    <link href="/resources/css/jquery-ui.custom.min.css" rel="stylesheet">
    <link href="/resources/css/font-awesome.min.css" rel="stylesheet">
    <script src="/resources/js/jquery.min.js"></script>
    <script src="/resources/js/bootstrap.min.js"></script>
    <script src="/resources/js/jquery-ui.custom.js"></script>
    <title>Выбор альтернатив</title>
</head>
<body>
<div class="container">
    <div class="row header">
        <button type="button" class="btn btn-primary">Модель ЖЦ</button>
        <button type="button" class="btn btn-primary">Выбор Альтернатив</button>
    </div>
<script type="text/javascript" src="<c:url value="/resources/js/alt_choose.js"/>" > </script>
    ${headerText}
<br/>
<form >
<input type="button" id="add_button" value="+"/>
<input type="button" id="sub_button" value="-"/>
<input type="submit" formmethod="POST" id="submit_button" value="Далее" />
    <br/>
    <br/>
<div id="alt_div">
    <ol id="alt_ordered_list">
        <li>
            <input type="text" name="input_alt"/>
        </li>
        <li>
            <input type="text" name="input_alt"/>
        </li>
    </ol>

</div>

</form>






<%@ include file="/WEB-INF/jsp/footer.jsp" %>