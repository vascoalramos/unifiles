package com.example.changekeeper;

import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.jjoe64.graphview.GraphView;
import com.jjoe64.graphview.LegendRenderer;
import com.jjoe64.graphview.ValueDependentColor;
import com.jjoe64.graphview.helper.DateAsXAxisLabelFormatter;
import com.jjoe64.graphview.series.BarGraphSeries;
import com.jjoe64.graphview.series.DataPoint;
import com.jjoe64.graphview.series.LineGraphSeries;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class GraphsGraphsFragment extends Fragment {
    private static final String TAG = "Graphs and stuff";
    ViewGroup thisView;
    HashMap<String, ArrayList<Double>> info = new HashMap<>();
    ArrayList<String> allDates = new ArrayList<>();
    double min;
    double max;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        thisView = (ViewGroup) inflater.inflate(
                R.layout.fragment_graphs, container, false);

        loadInfo();

        return thisView;
    }

    private void loadInfo(){
        loadFiles("UserIncomes");
        loadFiles("UserExpenses");
        loadFiles("UserLends");
        loadFiles("UserBorrows");

        Log.i(TAG,"Loading -oof- " + this.info.toString());

        if(this.allDates.size()!=0){
            sortInfoByDate();
            sumInfo();
            createGraph();
        }

    }

    private void createGraph() {
        int size = this.allDates.size();

        DataPoint[] ourIncomes = new DataPoint[size+1];
        DataPoint[] ourExpenses = new DataPoint[size+1];
        DataPoint[] average = new DataPoint[size+1];
        this.max = 0;
        this.min = 0;

        Calendar cal1 = Calendar.getInstance();

        cal1.set(Calendar.DAY_OF_MONTH,Integer.parseInt(this.allDates.get(0).split("/")[0])-1);
        cal1.set(Calendar.MONTH,Integer.parseInt(this.allDates.get(0).split("/")[1])-1);
        cal1.set(Calendar.YEAR,Integer.parseInt(this.allDates.get(0).split("/")[2]));
        Date d1 = cal1.getTime();
        ourIncomes[0] = new DataPoint(d1.getTime(), 0);
        ourExpenses[0] = new DataPoint(d1.getTime(), 0);
        average[0] = new DataPoint(d1.getTime(), 0);

        for (int i = 1; i < size+1; i++) {
            int j = i-1;
            cal1.set(Calendar.DAY_OF_MONTH,Integer.parseInt(this.allDates.get(j).split("/")[0]));
            cal1.set(Calendar.MONTH,Integer.parseInt(this.allDates.get(j).split("/")[1])-1);
            cal1.set(Calendar.YEAR,Integer.parseInt(this.allDates.get(j).split("/")[2]));
            d1 = cal1.getTime();
            ourIncomes[i] = new DataPoint(d1.getTime(), this.info.get(this.allDates.get(j)).get(0));

            if(this.max<this.info.get(this.allDates.get(j)).get(0))
                this.max = this.info.get(this.allDates.get(j)).get(0);
            Log.i(TAG, this.allDates.get(j)+" -oof- " + ourIncomes[i].toString());

            ourExpenses[i] = new DataPoint(d1.getTime(), this.info.get(this.allDates.get(j)).get(1));

            if(this.min>this.info.get(this.allDates.get(j)).get(1))
                this.min = this.info.get(this.allDates.get(j)).get(1);
            Log.i(TAG, this.allDates.get(j)+" -oof- " + ourExpenses[i].toString());

            average[i] = new DataPoint(d1.getTime(),this.info.get(this.allDates.get(j)).get(0)+this.info.get(this.allDates.get(j)).get(1));
        }
        Log.i(TAG, "-oof-" + this.allDates.size());



        GraphView graph = (GraphView) thisView.findViewById(R.id.graph);
        LineGraphSeries<DataPoint> series = new LineGraphSeries<>(ourExpenses);
        LineGraphSeries<DataPoint> series2 = new LineGraphSeries<>(ourIncomes);
        LineGraphSeries<DataPoint> series3 = new LineGraphSeries<>(average);

        graph.addSeries(series);
        graph.addSeries(series2);
        graph.addSeries(series3);

        series.setColor(Color.parseColor("#e74c3c"));
        series.setDrawDataPoints(true);
        series.setDataPointsRadius(20);
        series.setThickness(10);

        series2.setColor(Color.parseColor("#2ecc71"));
        series2.setDrawDataPoints(true);
        series2.setDataPointsRadius(20);
        series2.setThickness(10);

        series3.setDrawDataPoints(true);
        series3.setDataPointsRadius(10);
        series3.setThickness(10);

        Paint paint = new Paint();
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(15);
        paint.setColor(Color.parseColor("#3498db"));
        paint.setPathEffect(new DashPathEffect(new float[]{20, 30}, 0));

        series3.setDrawAsPath(true);
        series3.setCustomPaint(paint);

        // set manual X bounds
        cal1.set(Calendar.DAY_OF_MONTH,Integer.parseInt(this.allDates.get(0).split("/")[0])-1);
        cal1.set(Calendar.MONTH,Integer.parseInt(this.allDates.get(0).split("/")[1])-1);
        cal1.set(Calendar.YEAR,Integer.parseInt(this.allDates.get(0).split("/")[2]));

        d1 = cal1.getTime();

        cal1.set(Calendar.DAY_OF_MONTH,Integer.parseInt(this.allDates.get(this.allDates.size()-1).split("/")[0])+1);
        cal1.set(Calendar.MONTH,Integer.parseInt(this.allDates.get(this.allDates.size()-1).split("/")[1])-1);
        cal1.set(Calendar.YEAR,Integer.parseInt(this.allDates.get(this.allDates.size()-1).split("/")[2]));

        Date d2 = cal1.getTime();

        graph.getViewport().setMinX(d1.getTime());
        graph.getViewport().setMaxX(d2.getTime());
        graph.getViewport().setXAxisBoundsManual(true);

        // set manual Y bounds
        graph.getViewport().setYAxisBoundsManual(true);
        graph.getViewport().setMinY(this.min);
        graph.getViewport().setMaxY(this.max);
        // styling
        series.setTitle("Expenses");
        series2.setTitle("Incomes");
        series3.setTitle("Difference");
        graph.getLegendRenderer().setVisible(true);
        graph.getLegendRenderer().setBackgroundColor(Color.parseColor("#ecf0f1"));
        graph.getLegendRenderer().setAlign(LegendRenderer.LegendAlign.TOP);

        // set date label formatter
        graph.getGridLabelRenderer().setLabelFormatter(new DateAsXAxisLabelFormatter(getActivity()));
        graph.getGridLabelRenderer().setHorizontalAxisTitle("Dates");
        graph.getGridLabelRenderer().setVerticalAxisTitle("Money");

        graph.getGridLabelRenderer().setHumanRounding(false);
        graph.getGridLabelRenderer().setHorizontalLabelsAngle(45);

        graph.getGridLabelRenderer().setNumHorizontalLabels(this.allDates.size()+2);



    }



    private void loadFiles(String fileName) {
        try {
            FileInputStream fileInputStream = getActivity().openFileInput(fileName+".txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            String line;

            //Format: WALLET/CARD - Amount - Register Date - Person (LOANS) - Category(EXPENSES) - FrequencyType - Frequency - Weekdays - Description - PayDate(LOANS) - PAID/NOT PAID (LOANS)
            while((line = bufferedReader.readLine()) != null){
                String date = "";
                if(line.split(" - ")[5].equals("NULL"))
                    date = line.split(" - ")[2];
                else
                    date = calcNextDate(line.split(" - ")[2],line.split(" - ")[6],line.split(" - ")[5]);

                String amount = line.split(" - ")[1];

                if(!this.info.containsKey(date)){
                    Log.i(TAG,"BOAS PUTO " + line);

                    ArrayList<Double> temp = new ArrayList<>();
                    temp.add(Double.parseDouble(amount));
                    this.info.put(date,temp);

                    this.allDates.add(date);
                }else{
                    ArrayList<Double> temp = new ArrayList<>();
                    temp.add(Double.parseDouble(amount));
                    for(double i : this.info.get(date))
                        temp.add(i);
                    this.info.put(date,temp);
                }
            }

            Log.i(TAG,"In  " + fileName + " -oof- " + this.info.toString());

            bufferedReader.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void sumInfo(){

        for (Map.Entry<String, ArrayList<Double>> item : this.info.entrySet()) {
            double positive = 0;
            double negative = 0;

            for(Double i : item.getValue())
                if(i>0)
                    positive += i;
                else
                    negative += i;

            ArrayList<Double> temp = new ArrayList<>();
            temp.add(positive);
            temp.add(negative);
            this.info.put(item.getKey(),temp);
        }

    }

    private String calcNextDate(String dateOfReg,String frequency, String type){
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.DAY_OF_MONTH,Integer.parseInt(dateOfReg.split("/")[0]));
        cal.set(Calendar.MONTH,Integer.parseInt(dateOfReg.split("/")[1])-1);
        cal.set(Calendar.YEAR,Integer.parseInt(dateOfReg.split("/")[2]));

        Calendar current = Calendar.getInstance();


        switch(type){
            case "Day":
                do {
                    if(cal.equals(current))
                        break;
                    cal.add(Calendar.DAY_OF_MONTH, Integer.parseInt(frequency));
                }while(current.after(cal));
                break;
            case "Week":
                do {
                    if(cal.equals(current))
                        break;
                    cal.add(Calendar.WEEK_OF_MONTH, Integer.parseInt(frequency));
                }while(current.after(cal));
                break;
            case "Month":
                do {
                    if(cal.equals(current))
                        break;
                    cal.add(Calendar.MONTH, Integer.parseInt(frequency));
                }while(current.after(cal));
                break;
            case "Year":
                do {
                    if(cal.equals(current))
                        break;
                    cal.add(Calendar.YEAR, Integer.parseInt(frequency));
                }while(current.after(cal));
                break;
        }

        //Add support for weekdays
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;
        int day = cal.get(Calendar.DAY_OF_MONTH);

        String date = day+"/"+month+"/"+year;

        return date;
    }


    private boolean compareDate(String date1, String date2){
        Calendar cal1 = Calendar.getInstance();
        cal1.set(Calendar.DAY_OF_MONTH,Integer.parseInt(date1.split("/")[0]));
        cal1.set(Calendar.MONTH,Integer.parseInt(date1.split("/")[1])-1);
        cal1.set(Calendar.YEAR,Integer.parseInt(date1.split("/")[2]));

        Calendar cal2 = Calendar.getInstance();
        cal2.set(Calendar.DAY_OF_MONTH,Integer.parseInt(date2.split("/")[0]));
        cal2.set(Calendar.MONTH,Integer.parseInt(date2.split("/")[1])-1);
        cal2.set(Calendar.YEAR,Integer.parseInt(date2.split("/")[2]));

        return cal1.after(cal2); //True if cal 1 is sooner than cal2
    }

    private void sortInfoByDate(){
        for (int i = 1; i < this.allDates.size(); i++) {
            String key = this.allDates.get(i);
            int j = i - 1;
            while (j >= 0 && compareDate(this.allDates.get(j),key)) {
                int k = j+1;
                this.allDates.set(k,this.allDates.get(j));
                j = j - 1;
            }
            int k = j + 1;
            this.allDates.set(k,key);
        }
    }
}
