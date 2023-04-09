<?php

function electrcity() {
    $url =
    'https://www.epexspot.com/en/market-data?ajax_form=1&_wrapper_format=html&_wrapper_format=drupal_ajax';
    $curl = curl_init( $url );
    curl_setopt( $curl, CURLOPT_URL, $url );
    curl_setopt( $curl, CURLOPT_POST, true );
    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, true );

    #----------------------------------#

    $headers = [
        'Connection: keep-alive',
        'Content-Type: application/x-www-form-urlencoded',
        'Host: www.epexspot.com',
        'Referer: https://www.epexspot.com/en/market-data?market_area=AT&trading_date=' . Date( 'Y-m-d' ) . '&delivery_date=' . Date( 'Y-m-d', strtotime( '+1 day' ) ) . '&underlying_year=&modality=Auction&sub_modality=DayAhead&product=60&data_mode=graph&period=day',
        'ajax_form: 1',
        '_wrapper_format: drupal_ajax',
    ];

    #----------------------------------#

    curl_setopt( $curl, CURLOPT_HTTPHEADER, $headers );
    $data =
    'filters%5Bmodality%5D=Auction&filters%5Bsub_modality%5D=DayAhead&filters%5Btrading_date%5D=' .  Date( 'd' ) . '%20' . Date( 'M' ) . '.%20' . Date( 'Y' ) .  '&filters%5Bdelivery_date%5D=' . Date( 'd', strtotime( '+1 day' ) ) . '%20' . Date( 'M' ) . '.%20' . Date( 'Y' ) . '&filters%5Bproduct%5D=60&filters%5Bdata_mode%5D=graph&filters%5Bmarket_area%5D=AT&filters%5Bperiod%5D=year&triggered_element=filters%5Bdata_mode%5D&first_triggered_date=&form_build_id=form-PtdHvSGPvXq4x0229zJXzzvgM0b6FfyjO2BZWzc6oAY&form_id=market_data_filters_form&_triggering_element_name=submit_js&_triggering_element_value=&_drupal_ajax=1&ajax_page_state%5Btheme%5D=epex&ajax_page_state%5Btheme_token%5D=&ajax_page_state%5Blibraries%5D=bootstrap%2Fpopover%2Cbootstrap%2Ftooltip%2Ccore%2Fhtml5shiv%2Ccore%2Fjquery.form%2Cepex%2Fglobal-scripts%2Cepex%2Fglobal-styling%2Cepex_core%2Fdata-disclaimer%2Cepex_market_data%2Fauc_status%2Cepex_market_data%2Ffilters%2Cepex_market_data%2Fgraphs%2Cepex_market_data%2Fmap%2Cepex_market_data%2Ftables%2Ceu_cookie_compliance%2Feu_cookie_compliance_default%2Cstatistics%2Fdrupal.statistics%2Csystem%2Fbase';

    curl_setopt( $curl, CURLOPT_POSTFIELDS, $data );
    curl_setopt( $curl, CURLOPT_SSL_VERIFYHOST, false );
    curl_setopt( $curl, CURLOPT_SSL_VERIFYPEER, false );
    $resp = curl_exec( $curl );
    curl_close( $curl );

    #----------------------------------#

    $energyData = json_decode( json_decode( $resp )[ 0 ]->settings->charts->price );
    $PeakloadActuel = $energyData[ 2 ]->data;
    $BaseloadActuel = $energyData[ 1 ]->data;
    $BaseloadElec = [];
    $PeakloadElec = [];
    $DatesElec = [];
    $lastElecPriceBase = json_encode( end( $PeakloadActuel )->y ) ;
    $lastElecPricePeak = json_encode( end( $BaseloadActuel )->y ) ;
    $lastElecDatePeak = json_encode( end( $DatesElec ) );

    #----------------------------------#

    for ( $base = 0; $base < count( $BaseloadActuel );
    $base++ ) {
        array_push( $BaseloadElec, $energyData[ 1 ]->data[ $base ]->y );
        array_push( $PeakloadElec, $energyData[ 2 ]->data[ $base ]->y );
        $PowerDate = $energyData[ 2 ]->data[ $base ]->x;
        $PowerDate = substr( $PowerDate, 0, 10 );
        $PowerDate = "'" . date( 'r', $PowerDate ) . "'";
        $realdate = substr( $PowerDate, 5, 15 );
        array_push( $DatesElec, $realdate );
    }

    #----------------------------------#

    $Baseload        =  $BaseloadElec ;
    $Peakload        =  $PeakloadElec ;
    $cloture_Date    =  $DatesElec ;

    #----------------------------------#

    return [
        'lastClosureDate' => $lastElecDatePeak,
        'lastBaseload' => $lastElecPriceBase,
        'lastPeakload' => $lastElecPricePeak,

        'BaseloadFiltred' => $Baseload,
        'PeakloadFiltred' => $Peakload,
        'HorodatageFiltred' => $cloture_Date,
    ];
}
print_r( json_encode( electrcity() ) );

?>
