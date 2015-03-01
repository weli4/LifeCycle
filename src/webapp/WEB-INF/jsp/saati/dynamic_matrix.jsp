<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>
<link href="<c:url value="/resources/css/matrix-style.css"/>" rel="stylesheet"/>

<script type="text/javascript" src="<c:url value="/resources/js/dss.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/jquery.keyfilter.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/saati.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/dynamic-saati.js"/>"> </script>
<script type="text/javascript" src="<c:url value="/resources/js/jquery.flot.min.js"/>"> </script>




<br />
<div id="dop_bg" class=" jumbotron" >
    <div class="up_div">
        <h1 >Многокритериальный анализ альтернатив по методу Т.Саати</h1>

        <div class="clearfloat"></div>
    </div>

    <div id="main_div" >
        <div class="tb">
            <div class="cn l" ></div>
            <div class="cn r"></div>
        </div>



            <h2>Анализ альтернатив</h2>
            <div id="steps_panel" hidden="true">
                Шаг
                <span id="step_number">1</span>
                из
                <span id="step_count">${max_step}</span>
                :
                <span id="step_name">анализ критериев</span>
            </div>
            <p>Для указания уровня приоритета используйте числа от 1/9 до 9.</p>
            <p><span id="legend_helper"></span></p>
            <p><span id="input_helper" style="padding: 3px; background-color: red;font-weight: bold;color: white;display:none;"></span></p>

        <div class="row">
            <input type="button" name="calc_dynamic_matrix" value="Рассчитать" class="btn btn-default"/>
            <input type="button" name="toggle_dynamic" value="Сделать коэф. диманичным" class="btn btn-default"  >
            <input type="button" id="next" value="Далее" style="display:none"  class="btn btn-primary" />
            <input type="button" id="end" value="Завершить" style="display:none" class="btn btn-success"  />
        </div>

            <div class="row">
            <div id="matrix" class="col-lg-6" >
                    <form name="matrix">
                        <table cellpadding="0" cellspacing="0">
                            <c:forEach var="i" begin="0" end="${alternativesNumber - 1}">
                                <tr>
                                    <c:forEach var="j" begin="0" end="${alternativesNumber - 1}" >
                                        <c:choose>
                                            <c:when test="${j!=i}">
                                                <td><input type="text" name="matrix[${i}][${j}]" required="true" > </td>
                                            </c:when>
                                            <c:otherwise>
                                                <td><input type="text" name="matrix[${i}][${j}]" value="1" readonly="true" > </td>
                                            </c:otherwise>
                                        </c:choose>
                                    </c:forEach>
                                    <td class="legend_y">&#${65+i};</td>
                                </tr>
                            </c:forEach>


                            <tr>
                                <c:forEach var="i" begin="0" end="${alternativesNumber-1}">
                                    <td class="legend_x">&#${65+i};</td>
                                </c:forEach>

                                <td class="legend_x"></td>
                            </tr>
                        </table>

                    </form>
                </div>


            <div id="legend" class="col-lg-6">
                <b>Легенда:</b>
                <ol id="legend_ol" type="A">
                    <c:forEach var="i" begin="0" end="${alternativesNumber - 1}">
                        <li>${alternativesArray[i]}<span></span></li>
                    </c:forEach>
                </ol>


            </div></div>

            <div class="row">
                <div id="dynamic_control"  hidden="true" class="col-lg-6">
                Настройка динамичекского поля (<span id="dyn_coord_x"></span>,<span id="dyn_coord_y"></span>):
                <select id="cell_dynamic_type">
                    <option value="1">a(t)+b</option>
                    <option value="2">a*log(t+1)+b</option>
                    <option value="3">a*exp(b*t)+c</option>
                    <option value="4">a*t&#178 + b*t + c</option>
                </select>
                <br/>
                <table>

                    <tr>
                        <td>Коэф. а :</td>
                        <td><input type="text" title="a" id="rate_a" class="form-control"/> </td>
                    </tr>
                    <tr>
                        <td>Коэф. b :</td>
                        <td><input type="text" title="b" id="rate_b" class="form-control"/></td>
                    </tr>
                    <tr id="rate_c_container">
                        <td>Коэф. c :</td>
                        <td><input type="text" title="b" id="rate_c" class="form-control"/></td>
                    </tr>

                </table>

            </div>
                <div id="helper" class="col-lg-6">
                    <div id="matrix_helper_no" class="matrix_result" style="display:none;color:red;" class="label label-default">
                    Матрица не согласованна. Пересмотрите значения матрицы.
                </div>
                    <div id="error_comment" class="matrix_result" style="display:none;color:red;" class="label label-default">

                    </div>
                    <div id="matrix_helper_yes" class="matrix_result" style="display:none;color:green;" class="label label-default">
                        Матрица согласованна.
                    </div>
                    <br />
                    <div id="vectors" class="matrix_result" style="display:none;" class="label label-default">
                        Собственные векторы: <br />
                        <span id="vector"></span>
                    </div>
                    <div class="parametrs matrix_result" style="display:none;" class="label label-default">
                        Индексы: <br />
                        ? = <span id="lambda" class="label label-default"></span><br />
                        ИС = <span id="cons_index" class="label label-default"></span><br />
                        ОC = <span id="attit_cons" class="label label-default"></span>
                    </div>
                    <br/></div>
            </div>




    </div>
    <div class="row">
        <div id="result_field"  class="jumbotron" hidden="true">
            <h2>График изменения веса альтернатив в завивимости от указанного параметра.</h2>
            <div id="placeholder" style="position:relative; width: auto; height: 600px; background-color: #ffffff">
            </div>
            <br/>
            <a href="<c:url value="/saati/dynamic/multiple/reset"/>" role="button" class="btn btn-success"> Начать заново</a>
        </div>

    </div>
    <div class="up_div">

        <div hidden="true" id="multi_mode_flag">${multiModeFlag}</div>
    </div>
</div>





<%@ include file="/WEB-INF/jsp/footer.jsp" %>