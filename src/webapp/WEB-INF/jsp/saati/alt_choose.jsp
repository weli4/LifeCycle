<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>


<script type="text/javascript" src="<c:url value="/resources/js/alt_choose.js"/>" > </script>

<br/>
<div class="jumbotron">
    <h2>${headerText}</h2>
<form id="form" class="form-horizontal" role="form">
    <div class="form-group">
        <input type="button" id="add_button" value="Добавить" class="btn btn-primary"/>
        <input type="button" id="sub_button" value="Удалить" class="btn btn-primary"/>
        <input type="submit" formmethod="POST" id="submit_button" value="Далее"  class="btn btn-success"/>
    </div>

    <div class="form-group">
        <label class="col-sm-1 text-right" for="alt1">1</label>
        <div class="col-sm-6"><input type="text" class="form-control" id="alt1" name="input_alt"> </div>
    </div>
    <div class="form-group">
        <label class="col-sm-1 text-right" for="alt2">2</label>
        <div class="col-sm-6"><input type="text" class="form-control" id="alt2" name="input_alt"> </div>
    </div>


</form>
</div>






<%@ include file="/WEB-INF/jsp/footer.jsp" %>