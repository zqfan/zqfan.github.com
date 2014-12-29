<script type="text/javascript" src="../jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="../jquery-ui-1.10.4.min.js"></script>
<script type="text/javascript" src="../jquery.xlstablefilter-1.0.1.min.js"></script>
<script type="text/javascript">
  $(document).ready(function () {
    $("table").xlsTableFilter();
    $('table tr').hover(function () {
      $(this).find('td').addClass('hover');
    }, function () {
      $(this).find('td').removeClass('hover');
    });
  });
</script>
