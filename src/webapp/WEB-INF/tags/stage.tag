<%@ tag pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ attribute name="name" required="true" rtexprvalue="false" %>
<%@ attribute name="description" required="false" rtexprvalue="false" %>
<div class="stage">
    <div class="info">
        <span>${name}</span>
        <i class="fa fa-angle-double-right"></i>
        <div class="stage_process hide">
            Процессы:
        </div>
    </div>
    <div class="results hide">
        <span class="show">Результаты</span>
        <div class="data">
            <p>Результат1</p>
            <p>Результат2</p>
            <p>Результат3</p>
            <p>Результат4</p>
        </div>
    </div>
</div>