package com.example.changekeeper;

import android.app.DatePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatDialogFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import java.util.Calendar;

public class SearchDialog2 extends AppCompatDialogFragment implements AdapterView.OnItemSelectedListener{
    //Class used to create a new category for incomes/expenses
    private SearchDialogListener2 listener;
    private TextView mDisplayDate1;

    private View v;
    private DatePickerDialog.OnDateSetListener mDateSetListener1;

    private ArrayAdapter<CharSequence> typeAdapter;
    private ArrayAdapter<CharSequence> typeAdapter2;

    private String date;


    static SearchDialog2 newInstance() {
        return new SearchDialog2();
    }
    private boolean confirmed = false;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.layout_search_dialog2, null);
        View ultraView = view;
        this.v = view;


        Button butt  = view.findViewById(R.id.conf);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Spinner spinner = v.findViewById(R.id.frequencyPicker2);

                String date = "";
                switch(spinner.getSelectedItem().toString()){
                    case ("Today"):
                        date = "TODAY";
                        break;
                    case ("This year"):
                        date = "YEAR";
                        break;
                    case ("This month"):
                        date = "MONTH";
                        break;

                    case ("Any"):
                        date = "NULL";
                        break;

                    default:
                        date = spinner.getSelectedItem().toString();
                        break;

                }

                String desc = "";
                if(((EditText)v.findViewById(R.id.editDescription)).getText().toString().equals(null))
                    desc = "";
                else{
                    desc = ((EditText)v.findViewById(R.id.editDescription)).getText().toString();
                }

                Log.i("puto","lololo");
                listener.search(date,desc);
                dismiss();


            }
        });

        Button butt2  = view.findViewById(R.id.canc);
        butt2.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                listener.noUpdate();
                dismiss();
            }
        });


        buildDateSpinner(view,"NULL");

        return view;
    }


    private void buildDateSpinner(View view, String date){
        Spinner spinner = v.findViewById(R.id.frequencyPicker2);

        if(date.equals("NULL")){
            this.typeAdapter2 = ArrayAdapter.createFromResource(v.getContext(),R.array.dates,R.layout.spinner_item);
            spinner.setOnItemSelectedListener(this);

            this.typeAdapter2.setDropDownViewResource(R.layout.spinner_item);
            spinner.setAdapter(this.typeAdapter2);
            this.date = "NULL";

        }else{
            String[] items;
            items = new String[getResources().getStringArray(R.array.dates).length + 1];


            int j = 0;
            for(int i = 0; i < getResources().getStringArray(R.array.dates).length-1; i++){
                items[i] = getResources().getStringArray(R.array.dates)[i];
                j++;
            }
            items[j] = date;

            items[items.length-1] = getResources().getStringArray(R.array.dates)[getResources().getStringArray(R.array.dates).length-1];

            spinner.setOnItemSelectedListener(this);

            this.typeAdapter2= new ArrayAdapter<>(getActivity(), R.layout.spinner_item, items);
            spinner.setAdapter(this.typeAdapter2);

            spinner.setSelection(items.length-2);

        }
    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int pos, long id) {

            Calendar cal = Calendar.getInstance();
            int year = cal.get(Calendar.YEAR);
            int month = cal.get(Calendar.MONTH);
            int day = cal.get(Calendar.DAY_OF_MONTH);

            if (parent.getItemAtPosition(pos).toString().equals("Specific date...") && parent.getId() == R.id.frequencyPicker2){

                DatePickerDialog.OnDateSetListener mDateSetListener = new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(DatePicker datePicker, int year, int month, int day) {
                        month = month+1; //We do this cus by default January = 0
                        String date = day+"/"+month+"/"+year;

                        buildDateSpinner(v,date);
                    }

                };



                DatePickerDialog dialog = new DatePickerDialog(
                        getActivity(),
                        android.R.style.Theme_Holo_Light_Dialog_MinWidth,
                        mDateSetListener,
                        year,month,day);

                dialog.setButton(DialogInterface.BUTTON_NEGATIVE, "Cancel", new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                if (which == DialogInterface.BUTTON_NEGATIVE) {
                                    dialog.dismiss();
                                    Spinner sp = getView().findViewById(R.id.frequencyPicker2);
                                    sp.setSelection(0);
                                }
                            }
                        });

                dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                dialog.show();
            }

            else if(parent.getId() == R.id.frequencyPicker){
                switch(parent.getSelectedItem().toString()){
                    case ("Today"):
                        this.date = "TODAY";
                        break;
                    case ("This year"):
                        this.date = "YEAR";
                        break;
                    case ("This month"):
                        this.date = "MONTH";
                        break;

                    case ("Any"):
                        this.date = "NULL";
                        break;

                    default:
                        Spinner spinner = v.findViewById(R.id.frequencyPicker2);

                        this.date = spinner.getSelectedItem().toString();
                        break;

                }
            }
        }



    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {

        super.onViewCreated(view, savedInstanceState);
        Log.i("oi","lol:)");
        getDialog().getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        try {
            listener = (SearchDialogListener2) context;
        } catch (ClassCastException e) {
            throw new ClassCastException((context.toString() + "Did not implement FrequencyDialogueListener"));
        }
    }

    @Override
    public void onDismiss(DialogInterface dialog) {
        super.onDismiss(dialog);
        if(!confirmed)
            listener.noUpdate();

    }

    public interface SearchDialogListener2{
        void search(String date, String desc);
        void noUpdate();

    }

}


