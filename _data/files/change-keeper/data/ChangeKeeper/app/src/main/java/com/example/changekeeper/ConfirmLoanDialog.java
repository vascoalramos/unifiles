package com.example.changekeeper;

import android.content.Context;
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
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Calendar;

public class ConfirmLoanDialog extends AppCompatDialogFragment implements AdapterView.OnItemSelectedListener{
    //Class used to confirm
    private String walletAmount;
    private String cardAmount;
    private String current;
    private String amount;
    private ConfirmLoanDialogListener listener;
    private View v;
    private ArrayAdapter<CharSequence> destinationAdapter;


    static ConfirmLoanDialog newInstance() {
        return new ConfirmLoanDialog();
    }


    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        Log.i("boi","lol:)");
        getDialog().getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.layout_pay_loan_dialog,null);
        v = view;


        readFile();
        Bundle args = getArguments();
        Log.i("FDS", "OH PUTO WHAT!?");
        switch(args.getString("type")){
            case "borrow":
                ((TextView)view.findViewById(R.id.textView)).setText("Confirm debt payment to " + args.getString("person"));
                break;
            case "lend":
                ((TextView)view.findViewById(R.id.textView)).setText("Confirm " + args.getString("person") + " paid their debt");
                break;
        }
        this.amount = args.getString("amount");
        Log.i(":(","fds wtfcrl " + this.amount);

        if(Double.parseDouble(amount)>0){
            ((TextView)view.findViewById(R.id.registered3)).setText("+"+amount + "€");
            ((TextView)view.findViewById(R.id.registered3)).setTextColor(Color.parseColor("#2ecc71"));

        }
        else{
            ((TextView)view.findViewById(R.id.registered3)).setText(amount + "€");
            ((TextView)view.findViewById(R.id.registered3)).setTextColor(Color.parseColor("#e74c3c"));
        }


        ((TextView)view.findViewById(R.id.currentText3)).setText("Current money in Wallet:");
        this.current = this.walletAmount;

        ((TextView)view.findViewById(R.id.current3)).setText(current + "€");

        if(Double.parseDouble(current)>0)
            ((TextView)view.findViewById(R.id.current3)).setTextColor(Color.parseColor("#2ecc71"));
        else
            ((TextView)view.findViewById(R.id.current3)).setTextColor(Color.parseColor("#e74c3c"));

        double finalAmount = 0;
        finalAmount = Double.parseDouble(this.current) + Double.parseDouble(this.amount);

        Log.i("hm","FDSOI" + finalAmount);
        ((TextView)view.findViewById(R.id.moneyAfter3)).setText(finalAmount + "€");

        if(finalAmount>0)
            ((TextView)view.findViewById(R.id.moneyAfter3)).setTextColor(Color.parseColor("#2ecc71"));
        else
            ((TextView)view.findViewById(R.id.moneyAfter3)).setTextColor(Color.parseColor("#e74c3c"));


        Button butt  = view.findViewById(R.id.conf);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.i("puto","lololo");
                listener.pay(((Spinner)view.findViewById(R.id.destination)).getSelectedItem().toString());
            }
        });

        Button butt2  = view.findViewById(R.id.canc);
        butt2.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                dismiss();
            }
        });

        buildDestinationSpinner(view);

        return view;
    }

    private void buildDestinationSpinner(View v){
        String[] items = {"WALLET","CARD"};
        Spinner spinner = v.findViewById(R.id.destination);

        this.destinationAdapter = ArrayAdapter.createFromResource(v.getContext(),R.array.types,R.layout.spinner_item);
        spinner.setOnItemSelectedListener(this);

        this.destinationAdapter.setDropDownViewResource(R.layout.spinner_item);
        spinner.setAdapter(this.destinationAdapter);

    }

    @Override
    public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
        if(adapterView.getSelectedItem().toString().equals("WALLET")){
            ((TextView)this.v.findViewById(R.id.currentText3)).setText("Current money in Wallet:");
            ((ImageView)this.v.findViewById(R.id.imageView)).setImageResource(R.drawable.ic_walletback);


            this.current = this.walletAmount;
        }else{
            ((TextView)this.v.findViewById(R.id.currentText3)).setText("Current money in Card:");
            ((ImageView)this.v.findViewById(R.id.imageView)).setImageResource(R.drawable.ic_cardback);
            this.current = this.cardAmount;

        }

        ((TextView)this.v.findViewById(R.id.current3)).setText(current + "€");


        if(Double.parseDouble(current)>0)
            ((TextView)this.v.findViewById(R.id.current3)).setTextColor(Color.parseColor("#2ecc71"));
        else
            ((TextView)this.v.findViewById(R.id.current3)).setTextColor(Color.parseColor("#e74c3c"));

        double finalAmount = 0;
        finalAmount = Double.parseDouble(this.current) + Double.parseDouble(this.amount);

        Log.i("hm","FDSOI" + finalAmount);
        ((TextView)this.v.findViewById(R.id.moneyAfter3)).setText(finalAmount + "€");

        if(finalAmount>0)
            ((TextView)this.v.findViewById(R.id.moneyAfter3)).setTextColor(Color.parseColor("#2ecc71"));
        else
            ((TextView)this.v.findViewById(R.id.moneyAfter3)).setTextColor(Color.parseColor("#e74c3c"));


    }

    @Override
    public void onNothingSelected(AdapterView<?> adapterView) {

    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        try {
            listener = (ConfirmLoanDialogListener) context;
        } catch (ClassCastException e) {
            throw new ClassCastException((context.toString() + "Did not implement CategoryDialogueListener"));
        }
    }



    public interface ConfirmLoanDialogListener{
        void pay(String dest);
    }


    private void readFile() {
        try {
            FileInputStream fileInputStream = getActivity().openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            this.walletAmount = bufferedReader.readLine();
            this.cardAmount = bufferedReader.readLine();

            bufferedReader.close();
            inputStreamReader.close();
            fileInputStream.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}


