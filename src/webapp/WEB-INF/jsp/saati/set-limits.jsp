<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>
<link href="/resources/css/matrix-style.css" rel="stylesheet"/>
<script type="text/javascript" src="<c:url value="/resources/js/jquery.keyfilter.js"/>"> </script>
<script>
    $(document).ready(function(){
        $('input[name=low_limit]').keyfilter(/[0-9\.]/);
         $('input[name=top_limit]').keyfilter(/[0-9\.]/);
        $('input[name=step]').keyfilter(/[0-9\.]/);
    });

</script>

<div class="jumbotron" >
    <h2>Установить параметры изменяющегося значения</h2>
    <p>Здесь необходимо задать параметры изменения динамического параметра: от скольки до скольки от будет изменяться и скаким шагом.</p>
    <form role="form" class="form-horizontal">
        <input type="submit" formmethod="POST" id="submit_button" value="Далее" class="btn btn-success"/>

        <div class="form-group">
            <label for="low_limit" class="col-sm-3">Нижний лимит :</label>
            <div class="col-sm-6"><input id="low_limit"  type="text" name="low_limit" class="form-control"/></div>
        </div>
        <div class="form-group">
            <label for="top_limit" class="col-sm-3">Верхний лимит :</label>
            <div class="col-sm-6"><input id="top_limit"  type="text" name="top_limit" class="form-control"/></div>
        </div>
        <div class="form-group">
            <label for="step" class="col-sm-3">Шаг изменения :</label>
            <div class="col-sm-6"><input id="step"  type="text" name="step" class="form-control"/></div>
        </div>



    </form>

</div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>